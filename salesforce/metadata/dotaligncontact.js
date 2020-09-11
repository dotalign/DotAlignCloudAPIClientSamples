var metadata = {
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
};

module.exports = { metadata };