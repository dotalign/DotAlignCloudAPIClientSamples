require("dotenv").config();
var opn = require('opn');
var app = require("express")();
var jsforce = require("jsforce");
var dotAlignUtils = require("./dotaligncloud/dotAlignutils");
var dataOrchestrator = require("./salesforce/dataorchestrator");

const salesforceKey = process.env.SALESFORCE_KEY;
const salesforceSecret = process.env.SALESFORCE_SECRET;
const redirectUri = process.env.REDIRECT_URI;
const port = process.env.PORT;
const protocol = "http";
const host = "localhost";

app.get("/sflogin", function(req, res) {
  const oauth2 = new jsforce.OAuth2({
    clientId: salesforceKey,
    clientSecret: salesforceSecret,
    redirectUri: `${req.protocol}://${req.get("host")}/${redirectUri}`
  });

  res.redirect(oauth2.getAuthorizationUrl({}));
});

app.get(`/${redirectUri}`, async function(req, res) {
  const oauth2 = new jsforce.OAuth2({
    clientId: salesforceKey,
    clientSecret: salesforceSecret,
    redirectUri: `${req.protocol}://${req.get("host")}/${redirectUri}`
  });

  const oauthConnection = new jsforce.Connection({ oauth2: oauth2 });

  oauthConnection.authorize(req.query.code, async function(err, userInfo) {
    if (err) {
      return console.error(err);
    }

    const authenticatedConnection = new jsforce.Connection({
      instanceUrl: oauthConnection.instanceUrl,
      accessToken: oauthConnection.accessToken
    });

    authenticatedConnection.identity(async function(error, result) {
      if (error) {
        return console.error(error);
      }

      dotAlignUtils.logObject(result);

      await dataOrchestrator.kickOffDataSync(authenticatedConnection);
    });
  });
});

app.listen(port, host, () => {
  console.log(`App listening at ${protocol}://${host}:${port}`);
});

opn(`${protocol}://${host}:${port}/sflogin`);