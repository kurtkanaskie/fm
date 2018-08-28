@health
Feature: API proxy health
	As API administrator
	I want to monitor Apigee proxy and backend service health
	So I can alert when it is down
    
	@get-ping-password
    Scenario: Verify the backend service is responding
        Given I have a valid password access token
		When I GET /ping
        Then response code should be 200
        And response header Content-Type should be application/json
        And response body should contain PONG

    @get-status-password
    Scenario: Verify the backend service is responding
        Given I have a valid password access token
		When I GET /status
        Then response code should be 200
        And response header Content-Type should be application/json
        And response body should contain "status":"UP"
        
