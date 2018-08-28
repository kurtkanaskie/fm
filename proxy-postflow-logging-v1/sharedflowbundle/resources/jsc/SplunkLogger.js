/* globals context */
/* globals httpClient */
/* globals Request */

function getMessageHeaders() {
    var headerNames = context.getVariable('message.headers.names');
    var headerNamesArr = headerNames.toArray();
    var headersObj = {};
    for (var i = 0; i < headerNamesArr.length; i++) {
        // print("HEADER: " + headerNamesArr[i] + ":" + context.getVariable('message.header.'+headerNamesArr[i].toLowerCase())); 
        headersObj[headerNamesArr[i]] = context.getVariable('message.header.' + headerNamesArr[i]);
    }
    return headersObj;
}

// Gets logging level defined on proxy level
var proxyLogLevel = context.getVariable('ProxyLogLevel');

//print("proxyLogLevel: " +proxyLogLevel );

if(proxyLogLevel === null)
{
    // if proxyLevel logging is not set, set the logging level to INFO
   var loggingLevel = "INFO";
}
else{
    var loggingLevel = proxyLogLevel;
}

// gets the loggingUrl and credential information from KVM
var loggingURL = context.getVariable('logging_url');
var authorization_credentials = context.getVariable('authorization_credentials');

var request_start_time = context.getVariable('client.received.start.timestamp');
var target_start_time = context.getVariable('target.sent.start.timestamp');
var target_end_time = context.getVariable('target.received.end.timestamp');
var request_end_time = context.getVariable('system.timestamp');
var total_request_time = request_end_time - request_start_time;
var total_target_time = target_end_time - target_start_time;
var total_client_time = total_request_time - total_target_time;
var errorMessage = context.getVariable('error');

var logObject = {
    "event": {
        "logLevel": loggingLevel,
        "loggerName": "CommonApigeeLogger",
        "message": "API Response sent",
        "receivedTimestamp": new Date(request_start_time).toISOString(),
        "sentTimestamp": new Date(request_end_time).toISOString(),
        "messageid": context.getVariable("messageid"),
        "proxyDetails": {
            "organization": context.getVariable("organization.name"),
            "environment": context.getVariable("environment.name"),
            "apiProduct": context.getVariable("apiproduct.name"),
            "proxyName": context.getVariable("apiproxy.name"),
            "appName": context.getVariable("developer.app.name"),
            "verb": context.getVariable('logging.request.method'),
            "url": context.getVariable('logging.request.url'),
            "clientLatency": total_client_time,
            "targetLatency": total_target_time,
            "totalLatency": total_request_time,
        },
        "contextMap": {
            "request": {
                "method": context.getVariable('logging.request.method'),
                "url": context.getVariable('logging.request.url'),
                "headers": {
                },
                "content": {
                }
            },
            "response": {
                "status": context.getVariable("message.status.code"),
                "reason": context.getVariable("message.reason.phrase"),
                "headers": {
                },
                "content": {
                }
            }
        }
    }
};

if (errorMessage !== null && loggingLevel !== "DEBUG") {
    logObject.event.logLevel = "ERROR";
    logObject.event.contextMap.response.content = JSON.parse(context.getVariable('message.content'));
}

if (loggingLevel === "DEBUG") {
    logObject.event.logLevel = "DEBUG";

    if (errorMessage === null) {
        context.setVariable('logging.response.headers', JSON.stringify(context.proxyResponse.headers));
    }

    // Request content and headers logging
    logObject.event.contextMap.request.headers = context.getVariable('logging.request.headers');
    var reqContent = context.getVariable('logging.request.content');
    if (reqContent !== "" && reqContent !== undefined && reqContent !== null) {
        logObject.event.contextMap.request.content = JSON.parse(reqContent);
    }

    // Response content and headers logging
    logObject.event.contextMap.response.headers = getMessageHeaders();
    var responseContent = context.getVariable('message.content');
    if (responseContent !== "" && responseContent !== undefined && responseContent !== null) {
        logObject.event.contextMap.response.content = JSON.parse(context.getVariable('message.content'));
    }
}

var headers = {
    'Content-Type': 'application/json',
    'Authorization': authorization_credentials
};

var myLoggingRequest = new Request(loggingURL, "POST", headers, JSON.stringify(logObject));

httpClient.send(myLoggingRequest);