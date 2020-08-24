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

async function getTeamMemberFetchUrl(baseUrl, params) {
  var teamNumber = params.teamNumber;
  var skip = params.skip;
  var take = params.take;
  var includeHealthStats = params.includeHealthStats;
  var url = `${baseUrl}/teams/${teamNumber}/members?Skip=${skip}&Take=${take}&IncludeHealthStats=${includeHealthStats}`;
  return url;
}

async function getPeopleFetchUrl(baseUrl, params) {
  var teamNumber = params.teamNumber;
  var skip = params.skip;
  var take = params.take;
  var detailLevel = params.detailLevel;
  var url = `${baseUrl}/people?SourceTeam=${teamNumber}&Skip=${skip}&Take=${take}&IncludeDetailLevel=${detailLevel}`;
  return url;
}

async function kickOffPeopleFetch(environment) {

  var peopleCallParams = { 
    teamNumber: 1,
    skip: 0,
    take: 200,
    detailLevel: "IncludeDependentDetailsAndInteractionStats",
    totalFetchCount: 1000
  }

  var result = await dotAlignCloud.getDataHandleTokenExpiration(
    environment, 
    peopleCallParams,
    getPeopleFetchUrl);

  for (var i = 0; i < result.data.length; i++) {
    
    var person = { 
      name: result.data[i].PersonNameText,
      emailAddress: result.data[i].BestEmailAddrText,
      companyName: result.data[i].BestJobMatchedCompanyName,
      jobTitle: result.data[i].BestJobTitleText,
      bestIntroducer: result.data[i].BestKnowerNameText,
      phoneNumber: result.data[i].BestPhoneText,
      relationshipScore: result.data[i].WeKnowPersonScore
    };

    dotAlignUtils.logObject(person);
  }

  return result;
}

async function kickOffTeamMemberFetch(environment) {

  var teamCallParams = { 
    teamNumber: 1,
    skip: 0,
    take: 100,
    includeHealthStats: false,
    totalFetchCount: 200
  }

  var result = await dotAlignCloud.getDataHandleTokenExpiration(
    environment, 
    teamCallParams, 
    getTeamMemberFetchUrl);

  for (var i = 0; i < result.data.length; i++) { 
    
    var teamMember = { 
      name: result.data[i].name,
      emailAddress: result.data[i].email,
      teamName: result.data[i].teamName,
      teamNumber: result.data[i].teamNumber 
    };

    dotAlignUtils.logObject(teamMember);
  }

  return result;
}

async function kickOff() {
  var environment = await getEnvironmentParams();
  var members = await kickOffTeamMemberFetch(environment);
  var peoplr = await kickOffPeopleFetch(environment);
}

kickOff();