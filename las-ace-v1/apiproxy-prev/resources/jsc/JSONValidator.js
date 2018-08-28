/* globals print */
/* globals context */
/* globals tv4 */
/* globals oas */
function formatMessages(errors){
    var results =[];
    for (var i = 0; i < errors.length; i++  ){
        var error={};
        print( "DEBUG ERROR[" + i + "]=" + errors[i]);
        if (errors[i].dataPath)
        {
            
            if(errors[i].dataPath.indexOf("addressLineText") > 0){
                
                error = "SV002 - The Address Line Text for the property is required Please verify and re-submit. ," + errors[i].message + ", for field: " + errors[i].dataPath;
                
            }else if(errors[i].dataPath.indexOf("cityName") > 0){
                
                error = "SV003 - The City name for the property is required. Please verify and re-submit. ," + errors[i].message + ", for field: " + errors[i].dataPath;
                
            }else if(errors[i].dataPath.indexOf("sellerId") > 0){
                
                error = "SV001 - A Seller ID is required. Please verify and re-submit. ," + errors[i].message + ", for field: " + errors[i].dataPath;
                
            }else if(errors[i].dataPath.indexOf("fipsstateAlphaCode") > 0){
                
                error = "SV007 - The State code for the property is required. Please verify and re-submit. ," + errors[i].message + ", for field: " + errors[i].dataPath;
                
            }else if(errors[i].dataPath.indexOf("loanPurposeType") > 0){
                
                error = "SV005 - A valid Loan Purpose Type (Purchase or Refinance) is required. Please verify and re-submit. ," + errors[i].message + ", for field: " + errors[i].dataPath;
                
            }else if(errors[i].dataPath.indexOf("postalCode") > 0){
                
                error = "SV004 - The Postal Code for the property is required. Please verify and re-submit. ," + errors[i].message + ", for field: " + errors[i].dataPath;
                
            }else if(errors[i].dataPath.indexOf("propertyValueAmount") > 0){
                
                error = "SV006 - A purchase price or estimated poperty value amount is required. Please verify and re-submit. ," + errors[i].message + ", for field: " + errors[i].dataPath;
            }
            else{
                error = errors[i].message + ", for field: " + errors[i].dataPath;
            }
        }
        else {
              error = errors[i].message ;
        }
        results[i] = {"error" : error};
    }
    print( "DEBUG FORMATTED RESULT: " + JSON.stringify(results));
    return results;
}
function getMessageSchema( flowname ) {
    // Find the operationId that matches the flowname
    // Return the schema from the parameter that is "in" "body"
    // More efficient than using jsonPath
    var paths = oas.paths;
    for ( var path in paths ) {
        if (paths.hasOwnProperty(path)) {
            var verbs = paths[path];
            for( var verb in verbs ) {
                if( verbs.hasOwnProperty(verb)) {
                    if( verbs[verb].operationId === flowname ) {
                        var params = verbs[verb].parameters;
                        for ( var param in params ) {
                            if( params.hasOwnProperty(param)) {
                                if( params[param].hasOwnProperty( 'in' ) && params[param].in === 'body' ) {
                                    return params[param].schema;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return undefined;
}

try {
    var verb = context.getVariable('request.verb');
    var pathsuffix = context.getVariable('proxy.pathsuffix');
    var flowname = context.getVariable('current.flow.name');
    var schema = getMessageSchema( flowname );

    if( schema === undefined || schema === null ) {
        throw "Missing schema definition for: " + verb + " " + pathsuffix;
    }
    else {
        var bodyContent = context.getVariable('request.content');
        var body = JSON.parse(bodyContent);
        
        tv4.addSchema('/schema', oas);
        
        var result = tv4.validateMultiple(body, schema);
        
        // A missing schema validates to true, but we want that to be an error
        // Override missing entry with full schema value
        if( result.missing[0] ) {
            result.errors[0] = {"schema":schema};
            throw "Schema definition not found" + JSON.stringify(result.errors);
        }
        else if( result.valid === false ) {
			context.setVariable('schemavalidationjs', true);
			print( "DEBUG RAW RESULTS: " + result.errors);
            throw  formatMessages(result.errors);
        }
    }
}
catch( err ) {
    // This raises fault named "ScriptExecutionFailed", 
    // and sets errorMessage to the validation result
    context.setVariable('javascript.errorMessage', err);
    throw err;
}

