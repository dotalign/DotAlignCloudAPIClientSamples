# DotAlign Cloud API client samples

A sample client app that hits the the DotAlign Cloud API. 

## A bit of background

Once DotAlign Cloud is deployed on an Azure tenant, you can write client apps to hit its API. This does require some security related configuration on the tenant, including creating an app registration for your applcation, and granting it the rights to hit the API. You can speak to the tenant administrator or reach out to team@dotalign.com for more information. 

## Configure 

Once that configuration has happened, you can get the appropriate parameters and put them into the .env file. An example (.env.example) has been included in the repo to help illustrate the parameters. 

## Run the script

At that point, you can run the node script:

    > npm install 
    > node app.js

It will obtain an access token, and use that to iterate through all the people records available in DotAlign Cloud. If the token expires, it will get a new one. 