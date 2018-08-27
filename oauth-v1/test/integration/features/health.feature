@health
Feature: API proxy health
    As API administrator
    I want to monitor Apigee proxy and backend service health
    So I can alert when it is down

    @get-ping
    Scenario: Verify the API Proxy  is responding
        Given I set x-apikey header to `clientId`
        When I GET /ping
        Then response code should be 200
        And response header Content-Type should be application/json
        And response body should contain PONG

    @get-status
    Scenario: Verify the backend service is responding
        Given I set x-apikey header to `clientId`
		When I GET /status
        Then response code should be 200
        And response header Content-Type should be application/json
        And response body should contain STATUS