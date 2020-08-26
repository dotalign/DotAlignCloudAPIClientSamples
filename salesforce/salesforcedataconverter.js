var dotalignUtils = require('./../dotaligncloud/dotalignutils');

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

module.exports = { convertToDotAlignContacts }