require('dotenv').config();
const fetch = require("node-fetch");

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

async function getPeopleData(accessToken, callParams) {
  var sourceTeam = callParams.sourceTeam;
  var skip = callParams.skip;
  var take = callParams.take;
  var detailLevel = callParams.detailLevel;
  var fetched = 0;
  var areMore = true;
  var maxRetries = 3;
  var data = [];

  while (areMore) {
    var before = process.hrtime();

    var url = `${baseUrl}/people?SourceTeam=${sourceTeam}&Skip=${skip}&Take=${take}&IncludeDetailLevel=${detailLevel}`;
    
    var result = null;

    try {
      result = await getDataWithRetries(maxRetries, url, accessToken); 
      data.push(result.data);
    }
    catch (e) {
      console.log(`And exception was encountered while fetching data. ${fetched} records fetched so far.`)
      e.fetched = fetched;
      throw e;
    }
    
    areMore = result.are_more;
    skip += take;
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

async function getTeamMembers(accessToken, params) {
  var teamNumber = params.teamNumber;
  var skip = params.skip;
  var take = params.take;
  var fetched = 0;
  var areMore = true;
  var maxRetries = 3;
  var data = [];

  while (areMore) {
    var before = process.hrtime();

    var url = `${baseUrl}/teams/${teamNumber}/members?Skip=${skip}&Take=${take}&IncludeHealthStats=${includeHealthStats}`;
    
    var result = null;

    try {
      result = await getDataWithRetries(maxRetries, url, accessToken);
      data.push(result.data);
    }
    catch (e) {
      console.log(`And exception was encountered while fetching data. ${fetched} records fetched so far.`);
      e.fetched = fetched;
      throw e;
    }
    
    areMore = result.are_more;
    skip += take;
    fetched += result.data.length;

    var elapsed = process.hrtime(before);
    var seconds = elapsed[0];
    var milliseconds = elapsed[1];

    console.log(`Fetched ${result.page_start} to ${result.page_end} in ${seconds}.${milliseconds}s`);
  }

  console.log(`Done...fetched ${fetched} team member records`);

  return { 
    fetched: fetched,
    data: data
  };
}

async function doWork(functionToCall, params) {
  var response = await getAccessToken();
  var accessToken = response.access_token;
  var done = false;
  var fetched = 0;


  while (!done) {
    params.Skip = fetched;

    try {
      var before = process.hrtime();
      var runResult = await functionToCall(accessToken, params);
      var elapsed = process.hrtime(before);
      console.log(`Finished a run in ${elapsed[0]} seconds. ${runResult.fetched} items were fetched.`);
      done = true;
    } catch (e) {
      console.log(`An exception was encountered. Fetched ${e.fetched} so far.`)
      fetched = e.fetched;
      response = await getAccessToken();
      accessToken = response.access_token;
    }
  }
} 

var peopleCallParams = { 
  sourceTeam: 1,
  skip: 0,
  take: 100,
  detailLevel: "IncludeDependentDetailsAndInteractionStats"
}

doWork(getPeopleData, peopleCallParams);

// var teamCallParams = { 
//   teamNumber: 1,
//   skip: 0,
//   take: 100,
//   includeHealthStats: false
// }

// doWork(getTeamMembers, teamCallParams);