var metadata = {
    fullName: "DotAlignContributorContactRelationship__c",
    label: 'Contributor to contact relationship',
    pluralLabel: 'Contributor to contact relationships',
    enableActivities: "true",
    enableReports: "true",
    enableSearch: "true",
    enableSharing: "true",
    actionOverrides: [
         {
              "actionName": "CancelEdit",
              "type": "Default"
         },
         {
              "actionName": "SaveEdit",
              "type": "Default"
         }
    ],
    compactLayoutAssignment: "SYSTEM",
    enableFeeds: "false",
    nameField: {
        type: 'Text',
        label: 'contributor-contact relationship'
    },
    fields: [
         {
              fullName: "DotAlignContributorId__c",
              type: "Lookup",
              inlineHelpText: "The data contributor who is introducer in the contributor-contact relationship",
              trackHistory: "false",
              label: "Introducer",
              referenceTo: "DotAlignContributor__c",
              relationshipName: "DotAlignContributor"
         },
         {
              fullName: "DotAlignContactId__c",
              type: "Lookup",
              inlineHelpText: "The contact in the contributor-contact relationship",
              trackHistory: "false",
              label: "DotAlign Contact",
              referenceTo: "DotAlignContact__c",
              relationshipName: "DotAlignContributorContact"
         },
         {
              fullName: "RelationshipScore__c",
              type: "Number",
              label: "Relationship score",
              precision: 3,
              scale: 0,      
              inlineHelpText: "The relationship score between the introducer and the contact",
              defaultValue: "",
              trackHistory: "false"
         }],
    deploymentStatus: 'Deployed',
    sharingModel: 'ReadWrite'
};

module.exports = { metadata };