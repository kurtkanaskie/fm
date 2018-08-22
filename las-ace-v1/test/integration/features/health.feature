@health
Feature: API proxy health
	As API administrator
	I want to monitor Apigee proxy and backend service health
	So I can alert when it is down
    
	@get-health-password
    Scenario: Verify the backend service is responding
        Given I have a valid password access token
		When I GET /actuator/health
        Then response code should be 200
        And response header Content-Type should be application/json
        And response body should contain OK
        
