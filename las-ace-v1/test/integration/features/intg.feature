@intg
Feature: API proxy functionality
    As an API proxy developer
    I want to make valid requests
    So I know the API working properly
    
    @post-evaluation
    Scenario: Verify the backend service is responding
        Given I have a valid password access token
        Given I set Content-Type header to application/json
        And I set body to [{"addressLineText":"123 Main Street","cityName":"LalaLand","stateCode":"VA","loanPurposeType":"Purchase","postalCode":"12345","propertyEstimatedValueAmount":"200000.00","salesContractAmount":"250000.00","sellerId": "string"}]
        When I POST to /ace/evaluation
        Then response code should be 200
        And response header Content-Type should be application/json
        