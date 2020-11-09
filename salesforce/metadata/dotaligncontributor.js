var metadata = {
    fullName: "DotAlignContributor__c",
    label: 'DotAlign data contributor',
    pluralLabel: 'DotAlign data contributors',
    enableActivities: "true",
    enableReports: "true",
    enableSearch: "true",
    enableSharing: "true",
    nameField: {
        type: 'Text',
        label: 'Contributor name'
    },
    fields: [{
        fullName: "FullName__c",
        label: "Full Name",
        type: "Text",
        length: 200,
        inlineHelpText: "The employee's full name",
        defaultValue: ""
    }, {
        fullName: "EmailAddress__c",
        label: "Email address",
        type: "Email",
        inlineHelpText: "The official company email address of the employee",
        defaultValue: "",
        unique: "true"
    }],
    deploymentStatus: 'Deployed',
    sharingModel: 'ReadWrite'
};

module.exports = { metadata };