var dotAlignUtils = require('./../../dotaligncloud/dotalignutils');

async function convertToDotAlignContacts(peopleRecords) { 
    var contacts = [];

    for (var i = 0; i < peopleRecords.length; i++) {
        var person = peopleRecords[i];
        var contact = { 
            FullName__c: person.PersonNameText,
            EmailAddress__c: person.BestEmailAddrText,
            CompanyName__c:person.BestJobCorpLevelCompanyName,
            Score__c: person.WeKnowPersonScore,
            BestKnower__c: person.BestKnowerNameText
        }
        contacts.push(contact);
    }

    return contacts;
} 

async function convertToDotAlignAccounts(companyRecords) { 
    var accounts = [];

    for (var i = 0; i < companyRecords.length; i++) {
        var company = companyRecords[i];
        var account = { 
            CompanyName__c: company.CompanyNameText,
            Url__c: company.BestUrlText,
        }
        accounts.push(account);
    }

    return accounts;
} 

async function convertToDotAlignContributor(contributorRecords) { 
    var contributors = [];

    for (var i = 0; i < contributorRecords.length; i++) {
        var c = contributorRecords[i];
        var contributor = { 
            FullName__c: c.name,
            EmailAddress__c: c.email,
        }
        contributors.push(contributor);
    }

    return contributors;
} 

module.exports = { 
    convertToDotAlignContacts, 
    convertToDotAlignAccounts,
    convertToDotAlignContributor
}