var metadata = {
    fullName: "DotAlignAccountContactRelationship__c",
    label: 'DotAlign account contact relationship',
    pluralLabel: 'DotAlign account contact relationships',
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
        label: 'Contact-account relationship'
    },
    fields: [
         {
              fullName: "DotAlignAccountId__c",
              type: "Lookup",
              inlineHelpText: "The account in the contact-account relationship",
              trackHistory: "false",
              label: "DotAlign account",
              referenceTo: "DotAlignAccount__c",
              relationshipName: "DotAlignAccount"
         },
         {
              fullName: "DotAlignContactId__c",
              type: "Lookup",
              inlineHelpText: "The contact in the contact-account relationship",
              trackHistory: "false",
              label: "DotAlign contact",
              referenceTo: "DotAlignContact__c",
              relationshipName: "DotAlignContact"
         },
         {
              fullName: "JobTitle__c",
              type: "Text",
              label: "Job title",
              inlineHelpText: "The job title of the contact at the account",
              defaultValue: "",
              trackHistory: "false",
              length: 255
         },
         {
              fullName: "FirstEvidence__c",
              type: "Date",
              label: "First evidence",
              inlineHelpText: "The earliest evidence date of the contact-account relationship",
              defaultValue: "",
              trackHistory: "false"
         },
         {
              fullName: "LatestEvidence__c",
              type: "Date",
              label: "Latest evidence",
              inlineHelpText: "The most recent evidence date of the contact-account relationship",
              defaultValue: "",
              trackHistory: "false"
         },
         {
              fullName: "IsFormer__c",
              type: "Checkbox",
              label: "Is former",
              inlineHelpText: "Is the contact-account relationship believed to be a former relationship",
              defaultValue: false,
              trackHistory: "false"
    }],
    deploymentStatus: 'Deployed',
    sharingModel: 'ReadWrite'
};

module.exports = { metadata };