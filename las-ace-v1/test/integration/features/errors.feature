@errors
Feature: Error handling
	As an API consumer
	I want consistent and meaningful error responses
	So that I can handle the errors correctly

	@foo
    Scenario: GET /foo request not found
        Given I have a valid password access token
        When I GET /foo
        Then response code should be 404
        And response header Content-Type should be application/json
        And response body path $.message should be No resource for GET /foo
        
    @foobar
    Scenario: GET /foo/bar request not found
        Given I have a valid password access token
        When I GET /foo/bar
        Then I should get a 404 error with message "No resource for GET /foo/bar" and code "404.001"

    @post-evaluation-request-missing-content-type
    Scenario: Verify the proxy is validating request structure
        Given I have a valid password access token
        And I set body to [{"addressLineTextX":"123 Main Street","cityNameX":"LalaLand","stateCodeX":"VA","loanPurposeTypeX":"Purchase","postalCodeX":"12345","propertyEstimatedValueAmountX":"200000.00","salesContractAmountX":"250000.00","sellerIdX": "this element is optional"}]
        When I POST to /ace/evaluation
        Then response code should be 400
        And response header Content-Type should be application/json
        And response body should contain Missing header Content-type
        
    @post-evaluation-request-error-structure
    Scenario: Verify the proxy is validating request structure
        Given I have a valid password access token
        Given I set Content-Type header to application/json
        And I set body to [{"addressLineTextX":"123 Main Street","cityNameX":"LalaLand","stateCodeX":"VA","loanPurposeTypeX":"Purchase","postalCodeX":"12345","propertyEstimatedValueAmountX":"200000.00","salesContractAmountX":"250000.00","sellerIdX": "this element is optional"}]
        When I POST to /ace/evaluation
        Then response code should be 400
        And response header Content-Type should be application/json
        And response body should contain addressLineText
        And response body should contain cityName
        And response body should contain stateCode        
        And response body should contain loanPurposeType
        And response body should contain postalCode
        And response body should contain propertyEstimatedValueAmount
        And response body should contain salesContractAmount

    @post-evaluation-request-error-content
    Scenario: Verify the proxy is validating request content
        Given I have a valid password access token
        Given I set Content-Type header to application/json
        And I set body to [{"addressLineText":"123 Main Street!","cityName":"LalaLand!","stateCode":"XX","loanPurposeType":"Purchases","postalCode":"1234512345","propertyEstimatedValueAmount":"123456789012345678.00","salesContractAmount":"123456789012345678.00","sellerId": "this string must be less than sixty, that's 60 characters, really"}]
        When I POST to /ace/evaluation
        Then response code should be 400
        And response header Content-Type should be application/json
        And response body should contain addressLineText
        And response body should contain cityName
        And response body should contain stateCode        
        And response body should contain loanPurposeType
        And response body should contain postalCode
        And response body should contain propertyEstimatedValueAmount
        And response body should contain salesContractAmount
        
