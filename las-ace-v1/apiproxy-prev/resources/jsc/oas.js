// jshint ignore: start
var oas = {
	"swagger": "2.0",
	"info": {
		"description": "\"REST API for LAS ACE Offering\"",
		"version": "1.0.0",
		"title": "Loan Advisor Suite ACE REST API",
		"contact": {
			"name": "LAS API Developers",
			"url": "http://www.freddiemac.com/loanadvisorsuite/",
			"email": "las_api_developers@freddiemac.com"
		}
	},
	"host": "single-family-non-prod-dev.apigee.net",
	"basePath": "/loan-advisor-suite-ace-rest-api",
	"schemes": [
		"https"
	],
	"tags": [
		{
			"name": "operation-handler",
			"description": "Operation Handler"
		},
		{
			"name": "Appraisal Collateral Evaluation API",
			"description": "Set of operations for receiving Automated Collateral Evaluation"
		}
	],
	"paths": {
		"/ace/evaluation": {
			"post": {
				"tags": [
					"Appraisal Collateral Evaluation API"
				],
				"summary": "Verify if a Property is Freddie Mac ACE Eligible",
				"operationId": "getDecisionUsingPOST",
				"consumes": [
					"application/json"
				],
				"produces": [
					"application/json"
				],
				"parameters": [
					{
						"in": "body",
						"name": "requests",
						"description": "requests",
						"required": true,
						"schema": {
							"type": "array",
							"items": {
								"$ref": "#/definitions/AutomatedCollateralEvaluationRequest"
							}
						}
					}
				],
				"responses": {
					"200": {
						"description": "Success",
						"schema": {
							"type": "array",
							"items": {
								"$ref": "#/definitions/AutomatedCollateralEvaluationResponse"
							}
						}
					},
					"201": {
						"description": "Created"
					},
					"401": {
						"description": "You are not authorized to view the resource"
					},
					"403": {
						"description": "Accessing the resource you were trying to reach is forbidden"
					},
					"404": {
						"description": "The resource you were trying to reach is not found"
					}
				}
			}
		},
		"/actuator/health": {
			"get": {
				"tags": [
					"operation-handler"
				],
				"summary": "handle",
				"operationId": "handleUsingGET",
				"consumes": [
					"application/json"
				],
				"produces": [
					"application/json",
					"application/vnd.spring-boot.actuator.v2+json"
				],
				"parameters": [
					{
						"in": "body",
						"name": "body",
						"description": "body",
						"required": false,
						"schema": {
							"type": "object",
							"additionalProperties": {
								"type": "string"
							}
						}
					}
				],
				"responses": {
					"200": {
						"description": "OK",
						"schema": {
							"type": "object"
						}
					},
					"401": {
						"description": "Unauthorized"
					},
					"403": {
						"description": "Forbidden"
					},
					"404": {
						"description": "Not Found"
					}
				}
			}
		}
	},
	"definitions": {
		"Address": {
			"type": "object",
			"required": [
				"addressLineText",
				"cityName",
				"fipsstateAlphaCode",
				"postalCode"
			],
			"properties": {
				"addressLineText": {
					"type": "string",
					"example": "123 Main Street",
					"description": "The address with the address number, pre-directional, street name, post-directional, address unit designators and address unit value.",
					"minLength": 1,
					"maxLength": 100
				},
				"cityName": {
					"type": "string",
					"example": "LalaLand",
					"description": "The name of the city.",
					"minLength": 1,
					"maxLength": 50
				},
				"fipsstateAlphaCode": {
					"type": "string",
					"example": "VA",
					"description": "The two-character representation of the US state, US Territory, Canadian Province, Military APO FPO, or Territory.",
					"enum": [
						"AK",
						"AL",
						"AR",
						"AZ",
						"CA",
						"CO",
						"CT",
						"DC",
						"DE",
						"FL",
						"GA",
						"GU",
						"HI",
						"IA",
						"ID",
						"IL",
						"IN",
						"KS",
						"KY",
						"LA",
						"MA",
						"MD",
						"ME",
						"MI",
						"MN",
						"MO",
						"MS",
						"MT",
						"NC",
						"ND",
						"NE",
						"NH",
						"NJ",
						"NM",
						"NV",
						"NY",
						"OH",
						"OK",
						"OR",
						"PA",
						"PR",
						"RI",
						"SC",
						"SD",
						"TN",
						"TX",
						"UT",
						"VI",
						"VA",
						"VT",
						"WA",
						"WI",
						"WV",
						"WY"
					]
				},
				"postalCode": {
					"type": "string",
					"example": "12345",
					"description": "The postal code (ZIP Code in the US) for the address. ZIP Code may be either 5 or 9 digits.",
					"minLength": 1,
					"maxLength": 9
				}
			}
		},
		"AutomatedCollateralEvaluationRequest": {
			"type": "object",
			"required": [
				"addressLineText",
				"cityName",
				"loanPurposeType",
				"postalCode",
				"propertyEstimatedValueAmount",
				"salesContractAmount",
				"stateCode"
			],
			"properties": {
				"addressLineText": {
					"type": "string",
					"example": "123 Main Street",
					"description": "The address with the address number, pre-directional, street name, post-directional, address unit designators and address unit value.",
					"minLength": 1,
					"maxLength": 100,
					"pattern": "^[0-9A-Za-z\\s]*$"
				},
				"cityName": {
					"type": "string",
					"example": "LalaLand",
					"description": "The name of the city.",
					"minLength": 1,
					"maxLength": 50,
					"pattern": "^[0-9A-Za-z\\s]*$"
				},
				"loanPurposeType": {
					"type": "string",
					"example": "Purchase",
					"description": "Specifies the purpose for which the loan proceeds will be used.",
					"enum": [
						"Purchase",
						"Refinance"
					]
				},
				"postalCode": {
					"type": "string",
					"example": "12345",
					"description": "The postal code (ZIP Code in the US) for the address. ZIP Code may be either 5 or 9 digits.",
					"minLength": 1,
					"maxLength": 9,
					"pattern": "^[0-9]{5}(-[0-9]{4})?$"
				},
				"propertyEstimatedValueAmount": {
					"type": "string",
					"example": "200000.00",
					"description": "A statement of the estimated present market value of the property that is from the borrower or loan originator.",
					"minLength": 1,
					"maxLength": 20,
					"minimum": -100000000,
					"exclusiveMinimum": true,
					"maximum": 100000000,
					"exclusiveMaximum": true
				},
				"salesContractAmount": {
					"type": "string",
					"example": "200000.00",
					"description": "The amount of money the contract is for.",
					"minLength": 1,
					"maxLength": 20,
					"minimum": -100000000,
					"exclusiveMinimum": true,
					"maximum": 100000000,
					"exclusiveMaximum": true					
				},
				"sellerId": {
					"type": "string",
					"description": "The calling system seller ID",
					"minLength": 1,
					"maxLength": 60
				},
				"stateCode": {
					"type": "string",
					"example": "VA",
					"description": "The two-character representation of the US state, US Territory, Canadian Province, Military APO FPO, or Territory.",
					"enum": [
						"AK",
						"AL",
						"AR",
						"AZ",
						"CA",
						"CO",
						"CT",
						"DC",
						"DE",
						"FL",
						"GA",
						"GU",
						"HI",
						"IA",
						"ID",
						"IL",
						"IN",
						"KS",
						"KY",
						"LA",
						"MA",
						"MD",
						"ME",
						"MI",
						"MN",
						"MO",
						"MS",
						"MT",
						"NC",
						"ND",
						"NE",
						"NH",
						"NJ",
						"NM",
						"NV",
						"NY",
						"OH",
						"OK",
						"OR",
						"PA",
						"PR",
						"RI",
						"SC",
						"SD",
						"TN",
						"TX",
						"UT",
						"VI",
						"VA",
						"VT",
						"WA",
						"WI",
						"WV",
						"WY"
					]
				}
			},
			"description": "Class representing an address request to be evaluated by the application."
		},
		"AutomatedCollateralEvaluationResponse": {
			"type": "object",
			"required": [
				"address",
				"decisionExpirationDateTime"
			],
			"properties": {
				"aceDecision": {
					"type": "string",
					"description": "Freddie Mac ACE Decision"
				},
				"propertyValueAmount": {
					"type": "string"
				},
				"decisionExpirationDateTime": {
					"type": "string",
					"example": "2018-07-01",
					"description": "Freddie Mac ACE Decision Expiration Date. format (\"yyyy-MM-dd\")."
				},
				"address": {
					"description": "Standardized property address.",
					"$ref": "#/definitions/Address"
				},
				"messages": {
					"type": "array",
					"description": "Freddie Mac ACE Decision List of Messages.",
					"items": {
						"$ref": "#/definitions/Message"
					}
				}
			},
			"description": "Class representing the ACE Eligibility Response."
		},
		"Message": {
			"type": "object",
			"required": [
				"messageCode",
				"messageDescription"
			],
			"properties": {
				"messageCode": {
					"type": "string",
					"description": "Freddie Mac ACE Decision Messages Code"
				},
				"messageDescription": {
					"type": "string",
					"description": "Freddie Mac ACE Decision Messages Text"
				}
			}
		}
	}
};