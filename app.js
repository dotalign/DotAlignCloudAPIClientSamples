require('dotenv').config();
const fetch = require("node-fetch");
const dotAlignUtils = require("./dotalignUtils");
const dotAlignCloud = require("./dotalignCloud");

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

async function teamMemberFetchUrlCreator(baseUrl, params) {
  var teamNumber = params.teamNumber;
  var skip = params.skip;
  var take = params.take;
  var includeHealthStats = params.includeHealthStats;
  var url = `${baseUrl}/teams/${teamNumber}/members?Skip=${skip}&Take=${take}&IncludeHealthStats=${includeHealthStats}`;
  return url;
}

async function peopleFetchUrlCreator(baseUrl, params) {
  var teamNumber = params.teamNumber;
  var skip = params.skip;
  var take = params.take;
  var detailLevel = params.detailLevel;
  var url = `${baseUrl}/people?SourceTeam=${teamNumber}&Skip=${skip}&Take=${take}&IncludeDetailLevel=${detailLevel}`;
  return url;
}

async function contributorPeopleFetchUrlCreator(baseUrl, params) {
  var teamNumber = params.teamNumber;
  var skip = params.skip;
  var take = params.take;
  var detailLevel = params.detailLevel;
  var contributorKey = params.contributorKey;
  var url = `${baseUrl}/users/${contributorKey}/people?SourceTeam=${teamNumber}&Skip=${skip}&Take=${take}&IncludeDetailLevel=${detailLevel}`;
  return url;
}

async function contributorCompaniesFetchUrlCreator(baseUrl, params) {
  var teamNumber = params.teamNumber;
  var skip = params.skip;
  var take = params.take;
  var detailLevel = params.detailLevel;
  var contributorKey = params.contributorKey;
  var url = `${baseUrl}/users/${contributorKey}/companies?SourceTeam=${teamNumber}&Skip=${skip}&Take=${take}&IncludeDetailLevel=${detailLevel}`;
  return url;
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

async function kickOff() {
  var environment = await getEnvironmentParams();

  var teamMembersParams = {
    teamNumber: 1,
    skip: 0,
    take: 100,
    includeHealthStats: false,
    totalFetchCount: 200
  };

  var members = await dotAlignCloud.fetchDC(
    environment, 
    teamMembersParams, 
    teamMemberFetchUrlCreator);

  printTeamMembers(members.data);
  
  for (var i = 0; i < members.data.length; i++) { 
    var member = members.data[i];
    
    var params = { 
      teamNumber: 1,
      skip: 0,
      take: 200,
      detailLevel: "IncludeDependentDetailsAndInteractionStats",
      totalFetchCount: 1000,
      contributorKey: member.userKey
    };
    
    console.log(`Fetching people for ${member.userKey}`);

    var people = await dotAlignCloud.fetchDC(
      environment, 
      params, 
      contributorPeopleFetchUrlCreator);
    
    console.log(`Fetching companies for ${member.userKey}`);

    var companies = await dotAlignCloud.fetchDC(
      environment, 
      params, 
      contributorCompaniesFetchUrlCreator);
  }

  var peopleFetchParams = { 
    teamNumber: 1,
    skip: 0,
    take: 200,
    detailLevel: "IncludeDependentDetailsAndInteractionStats",
    totalFetchCount: 1000
  }

  var allPeople = await dotAlignCloud.fetchDC(
    environment, 
    peopleFetchParams, 
    peopleFetchUrlCreator);

  printPeople(allPeople.data);
}

kickOff();