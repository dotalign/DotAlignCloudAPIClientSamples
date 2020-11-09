const dotAlignCloud = require("../dotaligncloud/dotAlignCloud");
const dotAlignUrls = require("../dotaligncloud/dotAlignUrls");

async function run(
    environment,
      teamNumber, 
      numberOfContributors,
      peopleFetchCount,
      companiesFetchCount) {
    var teamMembersParams = {
        teamNumber: teamNumber,
        skip: 0,
        take: 100,
        includeHealthStats: false,
        totalFetchCount: numberOfContributors
    };

    var members = await dotAlignCloud.fetchDC(
        environment, 
        teamMembersParams, 
        dotAlignUrls.teamMemberFetchUrlCreator);
    
    var result = [];

    for (var i = 0; i < members.data.length; i++) { 
        var member = members.data[i];
      
        var params = { 
          teamNumber: teamNumber,
          skip: 0,
          take: 200,
          detailLevel: "IncludeDependentDetailsAndInteractionStats",
          totalFetchCount: peopleFetchCount,
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

        var userKey = member.userKey;

        result.push({ 
          contributor: member,
          people: people,
          companies: companies
        });
      }

      return result;
}

module.exports = { run }