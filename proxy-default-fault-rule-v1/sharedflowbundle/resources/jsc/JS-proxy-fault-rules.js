/* globals print */
/* globals context */
var faultName = context.getVariable("fault.name");

var code = null;
var description;
var responseCode;
var reasonPhrase;
var details = [];
switch (faultName) {
    case "InvalidAccessToken":
    case "invalid_access_token":
    case "FailedToResolveAPIKey":
        responseCode = "401";
        reasonPhrase = "Unauthorized";
        code = "401.001";
        description = "Invalid Access Token";
        details[0] = {
            "error": "Invalid Access Token, please validate the token, if error persists please renew your token."
        };
        break;

    case "access_token_expired":
        responseCode = "401";
        reasonPhrase = "Unauthorized";
        code = "401.002";
        description = "Access Token Expired";
        details[0] = {
            "error": "Access Token Expired, please renew your access token."
        };
        break;

    case "InvalidAPICallAsNoApiProductMatchFound":
        responseCode = "401";
        reasonPhrase = "Unauthorized";
        code = "401.003";
        description = "API Product mismatch for token";
        details[0] = {
            "error": "API Product mismatch for token. This means your token does not have access to the API, where request was sent to."
        };
        break;

    case "InvalidApiKey":
        responseCode = "401";
        reasonPhrase = "Unauthorized";
        code = "401.004";
        description = "Invalid API Key";
        details[0] = {
            "error": "Invalid API Key, please validate the Client ID"
        };
        break;

    case "InvalidApiKeyForGivenResource":
        responseCode = "401";
        reasonPhrase = "Unauthorized";
        code = "401.005";
        description = "Invalid API Key for given resource";
        details[0] = {
            "error": "Invalid API Key for given resource"
        };
        break;

    case "InsufficientScope":
        responseCode = "401";
        reasonPhrase = "Unauthorized";
        code = "401.006";
        description = "Insufficient scope for Application";
        details[0] = {
            "error": "Insufficient scope for Application"
        };
        break;

    case "SpikeArrestViolation":
        responseCode = "429";
        reasonPhrase = "Too Many Requests";
        code = "429.001";
        description = "Rate limit exceeded";
        details[0] = {
            "error": "Rate limit exceeded, decrease the number of request per second been sent."
        };
        break;

    case "QuotaViolation":
        responseCode = "429";
        reasonPhrase = "Too Many Requests";
        code = "429.002";
        description = "Quota limit exceeded";
        details[0] = {
            "error": "Quota limit exceeded, decrease the number of request per minute been sent."
        };
        break;

    // JSON ThreatProtection, XML ThreatProtection, Extract Variables, RegEx, JSON-XML, XML-JSON, ServiceCallout
    case "ExecutionFailed":
        if (context.getVariable("jsonattack.failed") === true || context.getVariable("xmlattack.failed") === true) {
            responseCode = "400";
            reasonPhrase = "Bad Request";
            code = "400.001";
            description = "Malformed Content";
            details[0] = {
                "error": "Malformed content from the client"
            };
        } else if (context.getVariable("servicecallout.SC-GetStatus.failed") === true || context.getVariable("servicecallout.SC-TAMCallout.failed") === true) {
                responseCode = context.getVariable("error.status.code");
                reasonPhrase = context.getVariable("error.reason.phrase");
                code = "500.000";
                description = "OAuth backend not responding";
        } else {
            // Uncaught ExecutionFailed related Raise Fault
            responseCode = context.getVariable("error.status.code");
            reasonPhrase = context.getVariable("error.reason.phrase");
            code = "400.000";
            description = "Uncaught ExecutionFailed fault";
        }
        
        break;

    case "RaiseFault":

        if (context.getVariable("raisefault.RF-path-suffix-not-found.failed") === true) {
            var uri = context.getVariable("proxy.pathsuffix");
            var verb = context.getVariable("request.verb");
            responseCode = "404";
            reasonPhrase = "Not Found";
            code = "404.001";
            description = "No resource for " + verb + " " + uri;
            details[0] = {
                "error": "No resource for " + verb + " " + uri
            };
        } else if (context.getVariable("raisefault.RF-MissingHeaderContentType.failed") === true) {
            responseCode = "400";
            reasonPhrase = "Bad Request";
            code = "401.008";
            description = "Missing header Content-type";
            details[0] = {
                "error": "Content-type must be either application/json or application/xml"
            };

        } else if (context.getVariable("raisefault.RF-InvalidCredentials.failed") === true) {
            responseCode = "401";
            reasonPhrase = "Unauthorized";
            code = "401.007";
            description = "Invalid Username/Password combinaton";
            details[0] = {
                "error": "Invalid Username/Password combinaton, the provided combination of username and password is incorrect, please verify your credentials."
            };

        } else if (context.getVariable("raisefault.RF-AccountLocked.failed") === true) {
            responseCode = "401";
            reasonPhrase = "Unauthorized- Account Locked";
            code = "401.008";
            description = "Unauthorized- Account Locked";
            details[0] = {
                "error": "Invalid Credentials, Too Many Incorrect Attempts, AccountLocked."
            };

        } else if (context.getVariable("oauthV2.failed") === true) {
            if (context.getVariable("response.status.code") === 400) {
                responseCode = "400";
                reasonPhrase = "Bad Request";
                code = "400.004";
                description = "Bad Request";
                details[0] = {
                    "error": "Invalid grant_type."
                };
            } else if (context.getVariable("response.status.code") === 401) {
                responseCode = "401";
                reasonPhrase = "Unauthorized - Bad Token";
                code = "401.009";
                description = "Invalid ClientSecret";
                details[0] = {
                    "error": "Invalid client_secret"
                };
            } else {
                // Uncaught OAuth related Raise Fault
                responseCode = context.getVariable("error.status.code");
                reasonPhrase = context.getVariable("error.reason.phrase");
                code = "400.000";
                description = "Uncaught OAuth related Raise Fault";
            }
        } else {
            responseCode = context.getVariable("error.status.code");
            reasonPhrase = context.getVariable("error.reason.phrase");
            code = "400.000";
            description = "Uncaught Raise Fault";
        }
        break;

    case "ScriptExecutionFailed":
        var javascriptErrorMessage = context.getVariable("javascript.errorMessage");
        if (context.getVariable("schemavalidationjs") === true) {
            responseCode = "400";
            reasonPhrase = "Bad Request";
            code = "400.002";
            description = "Request data does not match the application schema, please validate the request data.";
            //Gets the array already been returned by schema validation js
            details = javascriptErrorMessage;
        } else if (context.getVariable('request.content') === "") {
            responseCode = "400";
            reasonPhrase = "Bad Request";
            code = "400.005";
            description = "Bad Request";
            details[0] = {
                "error": "Empty request body"
            };

        } else {
            responseCode = "500";
            reasonPhrase = "Internal Server Error";
            code = "500.003";
            description = "Script execution failed";
            details[0] = {
                "error": "Server script encountered an unexpected error, MessageID: " + context.getVariable("messageid")
            };
        }
        break;

    // This should have an else to handle other UnresolvedVariable situations
    case "UnresolvedVariable":
        if (context.getVariable("BasicAuthentication.failed") === true) {
            responseCode = "400";
            reasonPhrase = "Bad Request";
            code = "400.003";
            description = "Bad Request";
            details[0] = {
                "error": "Missing Username or password"
            };
        } else {
            responseCode = "400";
            reasonPhrase = "Internal Error";
            code = "400.010";
            description = "Bad Request";
            details[0] = {
                "error": "Uncaught error, unresolved variable"
            };
        }
        break;
    
    // Backend error >= 400
    case "ErrorResponseCode":

        /* Althought this would work, it becomes difficult to manage as new proxies are developed
        if (context.getVariable('response.status.code') === 404 && context.getVariable('apiproxy.name').includes("ACE")) {
            responseCode = "401";
            reasonPhrase = "Unauthorized";
            code = "401.000";
            description = "Unauthorized client";
            details[0] = {
                "error": "Unable to authorize the client"
            };
        }
        */
        // This shared flow expects the API proxy to set target specific error variables
        code = context.getVariable("fm.target.error.code");
        print( "ErrorResponseCode " + context.getVariable('response.status.code') + " fm.target.error.code " + code);
        if( code !== null ) {
            responseCode = context.getVariable("fm.target.error.status");
            reasonPhrase = context.getVariable("fm.target.error.reason");
            description = context.getVariable("fm.target.error.description");
            details[0] = {
                "error": context.getVariable("fm.target.error.details")
            };
        }
        else {
            responseCode = "500";
            reasonPhrase = "Internal Error";
            code = "500.000";
            description = "Uncaught server error";
            details[0] = {
                "error": "Server encountered an unexpected error, MessageID: " + context.getVariable("messageid") + " faultName: " + faultName
            };
        }
        break;
    case "NoActiveTargets":
        responseCode = "500";
        reasonPhrase = "Internal Error";
        code = "500.002";
        description = "Target server not reachable";
        details[0] = {
            "error": "Target Server for " + context.getVariable("apiproxy.name")
        };
        break;
        
    case "SharedFlowNotFound":
        responseCode = "500";
        reasonPhrase = "Internal Error";
        code = "500.002";
        description = "Shared Flow Not Found";
        details[0] = {
            "error": "Shared Flow Not Found"
        };
        break;

    default:
        //  print( "DEBUG: faultName: " + faultName );
        responseCode = "500";
        reasonPhrase = "Internal Error";
        code = "500.001";
        description = "Uncaught server error";
        details[0] = {
            "error": "Server encountered an unexpected error, MessageID: " + context.getVariable("messageid") + " faultName: " + faultName
        };
}

print( "responseCode: "+responseCode + " reasonPhrase: "+reasonPhrase + " code: "+code + " description: "+description, " details: " + JSON.stringify(details));

context.setVariable("fm.error.status", responseCode);
context.setVariable("fm.error.reason", reasonPhrase);
context.setVariable("fm.error.code", code);
context.setVariable("fm.error.description", description);
context.setVariable("fm.error.detailsarray", JSON.stringify(details));