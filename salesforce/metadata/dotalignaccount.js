var metadata = {
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
};

module.exports = { metadata };