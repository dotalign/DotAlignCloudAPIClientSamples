const helpers = require("./dotaligncloud/helpers");
const iterator = require("./fetchers/iterateContributors");

async function main() {
  var environment = await helpers.getEnvironmentParams();
  var result = iterator.run(environment, 1, 2, 100, 100);
}

main();