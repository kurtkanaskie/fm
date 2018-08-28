/* globals context */
function getMessageHeaders() {
    var headerNames = context.getVariable('message.headers.names');
    var headerNamesArr = headerNames.toArray();
    var headersObj = {};
    for (var i=0; i < headerNamesArr.length; i++) {
        // print("HEADER: " + headerNamesArr[i] + ":" + context.getVariable('message.header.'+headerNamesArr[i].toLowerCase())); 
        headersObj[headerNamesArr[i]] = context.getVariable('message.header.' + headerNamesArr[i]);
      }
    return headersObj;
}

var req_verb = context.getVariable('request.verb');
var req_scheme = context.getVariable('client.scheme');
var req_host = context.getVariable('request.header.host');
var req_request_uri = context.getVariable('request.uri');
var req_url = req_scheme + "://" + req_host + req_request_uri;
context.setVariable( 'logging.request.method', req_verb);
context.setVariable( 'logging.request.url', req_url);
context.setVariable( 'logging.request.content', context.getVariable('message.content'));
//context.setVariable( 'logging.request.headers', JSON.stringify(context.proxyRequest.headers));
context.setVariable( 'logging.request.headers', getMessageHeaders());
