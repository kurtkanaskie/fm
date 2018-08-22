/* jslint node: true */
'use strict';
var calloutApickli = require('apickli');

module.exports = function () { 

    this.Given(/^I have a valid password access token$/, function (callback) {
        var oauthDomain = this.apickli.scenarioVariables["oauthDomain"];
        var oauthBasepath = this.apickli.scenarioVariables["oauthBasepath"];
        var clientId = this.apickli.scenarioVariables["clientId"];
        var clientSecret = this.apickli.scenarioVariables["clientSecret"];

        var userUsername = this.apickli.scenarioVariables["userUsername"];
        var userPassword = this.apickli.scenarioVariables["userPassword"];
        
        var callout = new calloutApickli.Apickli('https', oauthDomain + oauthBasepath);
        callout.addHttpBasicAuthorizationHeader(clientId,clientSecret);
        callout.addRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        callout.setRequestBody("grant_type=password&client_id="+clientId + "&client_secret="+clientSecret + "&username="+userUsername + "&password="+userPassword);
        
        var self = this;
        // console.log( "Edge: " + oauthDomain + oauthBasepath );
        callout.post("/token", function (error, response) {
            // console.log( "RESPONSE: " + JSON.stringify(response));
            if (error) {
                callback(new Error(error));
            }
            var access_token = callout.getAccessTokenFromResponseBodyPath("$.access_token");
            // console.log( "EDGE TOKEN: " + access_token + " externalAccessToken: " + externalAccessToken);
            self.apickli.setAccessToken(access_token);
            self.apickli.setBearerToken();
            callback();
        });
    });
};
