const nodeUtils = require('util');
const dotAlignUtils = require('../../dotaligncloud/dotalignUtils');
const dotAlignContact = require('./dotaligncontact');
const dotAlignAccount = require('./dotalignaccount');
const dotAlignContributor = require('./dotaligncontributor');
const dotAlignContactAccountRelationship = require('./dotalignaccountcontactrelationship');
const dotAlignContributorContactRelationship = require('./dotaligncontributorcontactrelationship');

var metadata = [
    dotAlignContact.metadata,
    dotAlignAccount.metadata,
    dotAlignContributor.metadata,
    dotAlignContactAccountRelationship.metadata,
    dotAlignContributorContactRelationship.metadata
];

var entities = {
    contact: metadata[0],
    account: metadata[1],
    contactAccountRelationship: metadata[2],
    contributorContactRelationship: metadata[3]
}

async function createSchema(connection) { 
    var asyncUpsert = nodeUtils
        .promisify(connection.metadata.upsert)
        .bind(connection.metadata);

    var result = await dotAlignUtils.asyncExecutor(
        asyncUpsert, 
        'CustomObject', 
        metadata);

    if (result.success == true) { 
        for (var i = 0; i < result.returnValue.length; i++) {
            var upsertResult = result.returnValue[i];
            dotAlignUtils.logObject(upsertResult);
        }
    } else { 
        dotAlignUtils.logObject(result.error);    
    }
}

async function readMetadata(connection, type, entities) { 

    var asyncRead = nodeUtils
        .promisify(connection.metadata.read)
        .bind(connection.metadata);

    var result = await dotAlignUtils.asyncExecutor(
        asyncRead,
        type, 
        entities);

    return result;
}

module.exports = {
    entities, 
    createSchema, 
    readMetadata
}