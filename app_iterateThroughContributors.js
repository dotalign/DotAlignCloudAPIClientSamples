const dotAlignUtils = require("./dotaligncloud/dotAlignUtils");
const dotAlignCloud = require("./dotaligncloud/dotAlignCloud");
const dotAlignUrls = require("./dotaligncloud/dotAlignUrls");
const helpers = require("./dotaligncloud/helpers");

async function main() {
  var environment = await helpers.getEnvironmentParams();

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
    dotAlignUrls.teamMemberFetchUrlCreator);
  
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
    
    console.log(`\n\nFetching people for ${member.userKey}`);
    console.log(`-------`);
    
    var people = await dotAlignCloud.fetchDC(
      environment, 
      params, 
      dotAlignUrls.contributorPeopleFetchUrlCreator);
    
    console.log(`\nFetching companies for ${member.userKey}`);
    console.log(`-------`);

    var companies = await dotAlignCloud.fetchDC(
      environment, 
      params, 
      dotAlignUrls.contributorCompaniesFetchUrlCreator);
  }
}

main();