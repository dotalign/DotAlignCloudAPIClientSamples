require('dotenv').config();
const dotalignUtils = require('./../dotaligncloud/dotalignutils');
const dotalignCloud = require('./../dotaligncloud/dotaligncloud');
const dotalignHelpers = require('./../dotaligncloud/helpers');
const metadata = require('./salesforcemetadata');
const dataConverter = require('./salesforcedataconverter');
const bulkDataHandler = require('./salesforcebulkdata');

async function kickOffDataSync(connection) {
    
    // Ensure the custom objects and fields we need are available
    // await metadata.createSchema(connection);

    await readMetadata(
        connection, 
        "CustomObject",
        [ "DotAlignContact__c", "DotAlignAccount__c" ]);

    await readMetadata(
        connection, 
        "Layout",
        [ "DotAlign contact Layout" ]);

    // Now connect to DotAlign's API
    // await connectToDotAlignCloudAndIteratePeopleRecords(connection);
}

async function readMetadata(connection, type, names) {
    var result = await metadata
        .readMetadata(
            connection,
            type, 
            names);

    if (result.success == true) {
        for (var i = 0; i < result.returnValue.length; i++) {
            var entityMetadata = result.returnValue[i];
            dotalignUtils.logObject(entityMetadata);
        }
    }
    else {
        dotalignUtils.logObject(result.error);
    }
}

async function iterateThroughPeopleRecords(connection) {
  var environment = dotalignHelpers.getDotAlignEnvironmentVariables();

  var params = {
    teamNumber: 1,
    skip: 0,
    take: 100,
    detailLevel: "IncludeDependentDetailsAndInteractionStats",
    totalFetchCount: 200
  };

  var people = await dotAlignCloud.fetchDC(
    environment, 
    params, 
    dotalignUrls.peopleFetchUrlCreator);
}

async function connectToDotAlignCloudAndIteratePeopleRecords(connection) { 
    var environment = await dotalignCloud.getDotAlignEnvironmentVariables();
    var fetched = 0;
    var done = false;

    // This while loop is to handle cases where an exception
    // stops the iteration and we have to get the access token 
    // again and restart the process from where it was left
    while (!done) {
        var response = await dotalignCloud.getAccessToken(environment);
        var accessToken = response.access_token;

        var callParams = { 
            sourceTeam: 1,
            skip: fetched,
            take: 100,
            detailLevel: "IncludeDependentDetailsAndInteractionStats",
            itemCount: 200
        };

        try {
            var before = process.hrtime();
            
            // var deleteResult = await bulkDataHandler.deleteAllContacts(
            //     connection, 
            //     metadata.entities.contact.fullName,
            //     { BestKnower__c: 'Vince Scafaria' });

            var runResult = await iterateThroughAllPeopleData(
                environment.baseUrl,
                accessToken,
                callParams, 
                connection);

            var elapsed = process.hrtime(before);
            console.log(`Finished a run in ${elapsed[0]} seconds. ${runResult.fetched} items were processed.`);
            done = true;
        } catch (e) {
            console.log(`An exception was encountered. Fetched ${e.fetched} so far.`)
            fetched = e.fetched;
        }
    }
} 

async function iterateThroughAllPeopleData(
    baseUrl,
    accessToken, 
    callParams,
    connection) {
    var fetched = 0;
    var areMore = true;

    while (areMore && fetched <= callParams.itemCount) {
        var before = process.hrtime();
        var peopleFetchResult = null;

        try {
            peopleFetchResult = await dotalignCloud.getPeopleData(baseUrl, accessToken, callParams);
            var peopleRecords = peopleFetchResult.fetchedObject.data;
            var contacts = await dataConverter.convertToDotAlignContacts(peopleRecords);
            var result = await bulkDataHandler.loadContacts(connection, contacts);
        }
        catch (e) {
            console.log(`And exception was encountered while fetching data. ${fetched} records fetched so far.`)
            e.fetched = fetched;
            throw e;
        }

        var fetchedObject = peopleFetchResult.fetchedObject;

        areMore = fetchedObject.are_more;
        callParams.skip += callParams.take;
        fetched += fetchedObject.data.length;

        var elapsed = process.hrtime(before);
        var seconds = elapsed[0];
        var milliseconds = elapsed[1];

        console.log(`Fetched ${fetchedObject.page_start} to ${fetchedObject.page_end} in ${seconds}.${milliseconds}s`);
    }

    console.log(`Done...fetched ${fetched} people records`);

    return { 
        fetched: fetched
    }
}

module.exports = { kickOffDataSync }