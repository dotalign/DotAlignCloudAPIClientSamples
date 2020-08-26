const nodeUtils = require('util');
const dotAlignUtils = require('./../dotaligncloud/dotalignutils');

var metadata = [{
    fullName: 'DotAlignContact__c',
    label: 'DotAlign contact',
    pluralLabel: 'DotAlign contacts',
    enableActivities: "true",
    enableReports: "true",
    enableSearch: "true",
    enableSharing: "true",
    nameField: {
        type: 'Text',
        label: 'Contact name'
    },
    fields: [{
        fullName: "FullName__c",
        label: "Name",
        type: "Text",
        length: 200,
        inlineHelpText: "The contact's full name",
        defaultValue: ""
    }, {
        fullName: "EmailAddress__c",
        label: "Email address",
        type: "Email",
        inlineHelpText: "The email address of the contact",
        defaultValue: "",
        unique: "true"
    }, {
        fullName: "CompanyName__c",
        label: "Company",
        type: "Text",
        length: 100,
        inlineHelpText: "The name of the company that the contact works at",
        defaultValue: ""
    }, {
        fullName: "Score__c",
        label: "Relationship score",
        type: "Number",
        precision: 3,
        scale: 0,
        inlineHelpText: "The relationship score of our firm with the contact",
        defaultValue: "",
        trackHistory: "false"
    }, {
        fullName: "BestKnower__c",
        label: "Best knower",
        type: "Text",
        length: 200,
        inlineHelpText: "The name of the person with the warmest relationship with the contact",
        defaultValue: ""
    }],
    deploymentStatus: 'Deployed',
    sharingModel: 'ReadWrite'
}, {
    fullName: 'DotAlignAccount__c',
    label: 'DotAlign account',
    pluralLabel: 'DotAlign accounts',
    enableActivities: "true",
    enableReports: "true",
    enableSearch: "true",
    enableSharing: "true",
    nameField: {
        type: 'Text',
        label: 'Company name'
    },
    fields: [{
        fullName: "CompanyName__c",
        label: "Name",
        type: "Text",
        length: 100,
        inlineHelpText: "The name of the company",
        defaultValue: "",
        unique: "true"
    }, {
        fullName: "Url__c",
        label: "Url",
        type: "Url",
        inlineHelpText: "The web address of the company",
        defaultValue: ""
    }],
    deploymentStatus: 'Deployed',
    sharingModel: 'ReadWrite'
}];

var entities = {
    contact: metadata[0],
    account: metadata[1]
}

async function createCustomObjects(connection) { 
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
    createCustomObjects, 
    readMetadata
}