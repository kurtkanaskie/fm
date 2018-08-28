# Proxy Default Fault Shared Flow

## Overview
Each proxy/shared flow source code module is self contained with config files for Edge Management API calls (e.g. KVMs, target servers), swagger spec and tests.
The key components enabling continuous integration are:
* VSTS - build server
* Maven - builder
* JSHint - static code analysis
* Mocha, Sinon - Javascript unit testing
* Apickli - cucumber extension for RESTful API testing
* Cucumber - Behavior Driven Development
* JMeter - Performance testing

### Frequently used commands:
mvn validate
- mvn jshint:lint
- mvn exec:exec@unit

mvn -Pdev clean process-resources exec:exec@integration -Ddeployment.suffix= -Dapi.testtag=@intg
node ./node_modules/cucumber/bin/cucumber.js target/test/integration/features --tags @foobar-standard

mvn install -Pdev -Ddeployment.suffix= 
