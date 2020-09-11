require('dotenv').config();
const dotAlignUtils = require('./../dotaligncloud/dotAlignutils');
const dotAlignCloud = require('./../dotaligncloud/dotAligncloud');
const dotAlignHelpers = require('./../dotaligncloud/helpers');
const dotAlignUrls = require('./../dotaligncloud/dotAlignUrls');
const metadata = require('./salesforcemetadata');
const dataConverter = require('./salesforcedataconverter');
const bulkDataHandler = require('./salesforcebulkdata');

async function kickOffDataSync(connection) {
    
    // Ensure the custom objects and fields we need are available
    await metadata.createSchema(connection);
    var peopleFetchResult = await fetchPeopleRecords(connection);
    var peopleRecords = peopleFetchResult.data;
    var contacts = await dataConverter.convertToDotAlignContacts(peopleRecords);
    // var result = await bulkDataHandler.loadContacts(connection, contacts);
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
            dotAlignUtils.logObject(entityMetadata);
        }
    }
    else {
        dotAlignUtils.logObject(result.error);
    }
}

async function fetchPeopleRecords(connection) {
  var environment = await dotAlignHelpers.getEnvironmentParams();

    var params = {
        teamNumber: 1,
        skip: 0,
        take: 100,
        detailLevel: "IncludeDependentDetailsAndInteractionStats",
        totalFetchCount: 200
    };

    var peopleFetchResult = await dotAlignCloud.fetchDC(
        environment, 
        params, 
        dotAlignUrls.peopleFetchUrlCreator);

    return peopleFetchResult;
}

module.exports = { kickOffDataSync }