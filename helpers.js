require('dotenv').config();
const dotAlignUtils = require("./dotalignUtils");

async function getEnvironmentParams() {
  return params = {
      baseUrl: process.env.DOTALIGN_CLOUD_BASE_URL,
      tenant_id: process.env.TENANT_ID,
      grant_type: "client_credentials",
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      scope: process.env.SCOPE,
  };
}

async function printPeople(people) { 
  for (var i = 0; i < people.length; i++) {
    var person = { 
      name: people[i].PersonNameText,
      emailAddress: people[i].BestEmailAddrText,
      companyName: people[i].BestJobMatchedCompanyName,
      jobTitle: people[i].BestJobTitleText,
      bestIntroducer: people[i].BestKnowerNameText,
      phoneNumber: people[i].BestPhoneText,
      relationshipScore: people[i].WeKnowPersonScore
    };

    dotAlignUtils.logObject(person);
  }
}

async function printTeamMembers(members) {
  for (var i = 0; i < members.length; i++) {
    var member = { 
      name: members[i].name,
      emailAddress: members[i].email,
      teamName: members[i].teamName,
      teamNumber: members[i].teamNumber
    };

    dotAlignUtils.logObject(member);
  }
}

module.exports = { getEnvironmentParams, printPeople, printTeamMembers };