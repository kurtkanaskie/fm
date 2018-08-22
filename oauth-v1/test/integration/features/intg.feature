@intg
Feature: API proxy functionality
	As an API proxy developer
	I want to make valid requests
	So I know the API working properly
    
	@password
    Scenario: Create password grant token
        Given I set Content-Type header to application/x-www-form-urlencoded
        And I set body to grant_type=password&client_id=`clientId`&client_secret=`clientSecret`&username=`userUsername`&password=`userPassword`
        When I POST to /token
        Then response code should be 200
        And response header Content-Type should be application/json
        And response body should contain access_token
        And response body should contain UserName

