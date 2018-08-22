@errors
Feature: Error handling
	As an API consumer
	I want consistent and meaningful error responses
	So that I can handle the errors correctly

	@not-found
    Scenario: GET /foo request not found
        When I GET /foo
        Then response code should be 404
        And response body should contain code

    @missing-grant_type
    Scenario: Missing grant_type
        Given I set Content-Type header to application/x-www-form-urlencoded
        And I set body to client_id=`clientId`&client_secret=`clientSecret`&username=`userUsername`&password=`userPassword`
        When I POST to /token
        Then response code should be 400
        And response body should contain code

    @missing-client_id
    Scenario: Missing client_id
        Given I set Content-Type header to application/x-www-form-urlencoded
        And I set body to grant_type=password&client_secret=`clientSecret`&username=`userUsername`&password=`userPassword`
        When I POST to /token
        Then response code should be 401
        And response body should contain code

    @missing-client_secret
    Scenario: Missing client_secret
        Given I set Content-Type header to application/x-www-form-urlencoded
        And I set body to grant_type=password&client_id=`clientId`&username=`userUsername`&password=`userPassword`
        When I POST to /token
        Then response code should be 401
        And response body should contain code

    @missing-username
    Scenario: Missing username
        Given I set Content-Type header to application/x-www-form-urlencoded
        And I set body to grant_type=password&client_id=`clientId`&client_secret=`clientSecret`&password=`userPassword`
        When I POST to /token
        Then response code should be 400
        And response body should contain code

    @missing-password
    Scenario: Missing password
        Given I set Content-Type header to application/x-www-form-urlencoded
        And I set body to grant_type=password&client_id=`clientId`&client_secret=`clientSecret`&username=`userUsername`
        When I POST to /token
        Then response code should be 400
        And response body should contain code

    @invalid-grant_type
    Scenario: Invalid grant_type
        Given I set Content-Type header to application/x-www-form-urlencoded
        And I set body to grant_type=foo&client_id=`clientId`&client_secret=`clientSecret`&username=`userUsername`&password=`userPassword`
        When I POST to /token
        Then response code should be 400
        And response body should contain code

    @invalid-client_id
    Scenario: Invalid client_id
        Given I set Content-Type header to application/x-www-form-urlencoded
        And I set body to grant_type=password&client_id=foo&client_secret=`clientSecret`&username=`userUsername`&password=`userPassword`
        When I POST to /token
        Then response code should be 401
        And response body should contain code

    @invalid-client_secret
    Scenario: Invalid client_secret
        Given I set Content-Type header to application/x-www-form-urlencoded
        And I set body to grant_type=password&client_id=`clientId`&client_secret=foo&username=`userUsername`&password=`userPassword`
        When I POST to /token
        Then response code should be 401
        And response body should contain code

    @invalid-username
    Scenario: Invalid username
        Given I set Content-Type header to application/x-www-form-urlencoded
        And I set body to grant_type=password&client_id=`clientId`&client_secret=`clientSecret`&username=foo&password=`userPassword`
        When I POST to /token
        Then response code should be 401
        And response body should contain code

    @invalid-password
    Scenario: Invalid password
        Given I set Content-Type header to application/x-www-form-urlencoded
        And I set body to grant_type=password&client_id=`clientId`&client_secret=`clientSecret`&username=`userUsername`&password=foo
        When I POST to /token
        Then response code should be 401
        And response body should contain code

    
        