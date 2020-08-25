# DotAlign Cloud API client samples

A sample client app that hits the the DotAlign Cloud API. 

## A bit of background

Once DotAlign Cloud is deployed on an Azure tenant, you can write client apps to hit its API. This does require some security related configuration on the tenant, including creating an app registration for your client application, and granting it the rights to hit the API. You can speak to the tenant administrator or reach out to team@dotalign.com for more information. 

## Configure 

Once that configuration has happened, you can get the appropriate parameters and put them into the .env file. An example (.env.example) has been included in the repo to help illustrate the parameters. 

Note that you should keep the paramters that allow you to hit the DotAlign Cloud API, secret and only in the .env file. In this repo, the .env file is not checked into source control via a .gitignore entry.

## npm install 

Make sure the required modules are installed, by running the following command.

    > npm install 

## Run the script

Now you can run one of the sample programs. The runnable programs have the format `app_<SOMENAME>`

    > node app_iterateThroughContributors.js

What this program does is fetch the members of a team, and then iterate through all members to get each member's people and companies.

## Extra

The sample programs use the `dotAlignCloud` module which will obtain an access token, and use that to access the various API end points. If the token expires, the module will automatically get a new one.