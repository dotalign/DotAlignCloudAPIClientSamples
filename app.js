require('dotenv').config();
const fetch = require("node-fetch");
const dotAlignUtils = require("./dotalignUtils");

const baseUrl = process.env.DOTALIGN_CLOUD_BASE_URL;

const params = {
    tenant_id: process.env.TENANT_ID,
    grant_type: "client_credentials",
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    scope: process.env.SCOPE,
};

// POST utility function
async function postData(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    body: body,
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
 
  return response.json();
}

// GET utility function
async function getData(url, accessToken) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      "Authorization": "Bearer " + accessToken
    }
  });

  return response.json();
}

// This function gets an access token from Azure AD
async function getAccessToken() {
  var authEndpoint = `https://login.microsoftonline.com/${params.tenant_id}/oauth2/v2.0/token`;

  var body = `grant_type=${params.grant_type}&client_id=${params.client_id}&`
    + `client_secret=${params.client_secret}&tenant_id=${params.tenant_id}&scope=${params.scope}`
  
  var response = await postData(authEndpoint, body);
  return response;
}

async function getDataWithRetries(maxRetries, url, accessToken) {
  var tryCount = 0;
  var response = null;

  while (tryCount < maxRetries) { 
    try {
      response = await getData(url, accessToken);
      break;
    }
    catch (e) { 
      console.log(e);

      tryCount++;

      if (tryCount == maxRetries) { 
        console.log(`Failed to get data after ${maxRetries} tries...`);
        throw { 
          exception: e,
          response: response
        }
      }
    }
  }

  return response;
}

async function getSomeData(baseUrl, accessToken, params, urlCreator) {
  var totalFetchCount = params.totalFetchCount;
  var fetched = 0;
  var areMore = true;
  var maxRetries = 3;
  var data = [];

  while (areMore && fetched < totalFetchCount) {
    var before = process.hrtime();
    var url = await urlCreator(baseUrl, params);
    var result = null;

    try {
      result = await getDataWithRetries(maxRetries, url, accessToken); 

      for (var i = 0; i < result.data.length; i++) { 
        data.push(result.data[i]);
      }
    }
    catch (e) {
      console.log(`And exception was encountered while fetching data. ${fetched} records fetched so far.`)
      e.fetched = fetched;
      throw e;
    }
    
    areMore = result.are_more;
    params.skip += params.take;
    fetched += result.data.length;

    var elapsed = process.hrtime(before);
    var seconds = elapsed[0];
    var milliseconds = elapsed[1];

    console.log(`Fetched ${result.page_start} to ${result.page_end} in ${seconds}.${milliseconds}s`);
  }

  console.log(`Done...fetched ${fetched} people records`);

  return { 
    fetched: fetched,
    data: data
  }
}

async function getDataHandleTokenExpiration(baseUrl, params, urlCreator) {
  var response = await getAccessToken();
  var accessToken = response.access_token;
  var done = false;
  var fetched = 0;

  while (!done) {
    params.skip = fetched;

    var result = null;

    try {
      var before = process.hrtime();
      result = await getSomeData(baseUrl, accessToken, params, urlCreator);
      var elapsed = process.hrtime(before);
      console.log(`Finished a run in ${elapsed[0]} seconds. ${result.fetched} items were fetched.`);
      done = true;
    } catch (e) {
      dotAlignUtils.logObject(e);
      console.log(`An exception was encountered. Fetched ${e.fetched} so far.`)
      fetched = e.fetched;
      response = await getAccessToken();
      accessToken = response.access_token;
    }
  }

  return result;
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

async function kickOffPeopleFetch() {

  var peopleCallParams = { 
    teamNumber: 1,
    skip: 0,
    take: 200,
    detailLevel: "IncludeDependentDetailsAndInteractionStats",
    totalFetchCount: 1000
  }

  var result = await getDataHandleTokenExpiration(baseUrl, peopleCallParams, getPeopleFetchUrl);

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
}

async function kickOffTeamMemberFetch() {

  var teamCallParams = { 
    teamNumber: 1,
    skip: 0,
    take: 100,
    includeHealthStats: false,
    totalFetchCount: 200
  }

  var result = await getDataHandleTokenExpiration(baseUrl, teamCallParams, getTeamMemberFetchUrl);

  for (var i = 0; i < result.data.length; i++) { 
    
    var teamMember = { 
      name: result.data[i].name,
      emailAddress: result.data[i].email,
      teamName: result.data[i].teamName,
      teamNumber: result.data[i].teamNumber 
    };

    dotAlignUtils.logObject(teamMember);
  }
}

kickOffTeamMemberFetch();

kickOffPeopleFetch();