const helpers = require("./dotaligncloud/helpers");
const iterator = require("./fetchers/iterateContributors");

async function main() {
  
  var environment = await helpers.getEnvironmentParams();
  
  // This will iterate through data contributors and fetch 
  // people and companies for each of them
  
  var result = iterator.run(
      environment, 
      1, // teamNumber
      2, // the number of "data conributors" to fetch for
      100, // the number of person records to fetch
      100); // the number of company records to fetch
}

main();
