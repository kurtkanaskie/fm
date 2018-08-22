# OAuth V1

## Overview
Each proxy source code module is self contained with the actual Apigee Edge proxy, config files for Edge Management API calls (e.g. KVMs, target servers), swagger spec and tests.
The key components enabling continuous integration are:
* Jenkins - build engine
* Maven - builder
* Apickli - cucumber extension for RESTful API testing
* Cucumber - Behavior Driven Development
* JMeter - Performance testing

Basically, everything that Jenkins does using Maven and other tools can be done locally, either directly with the tool (e.g. jslint, cucumberjs) or via Maven commands. The sections below show how to do each.

Jenkins projects are set up to run using Maven and Maven runs via configurations in a pom file (pom.xml). Maven follows a phased approach to execute commands and generally the result of that execution is to create a "target" directory to hold the output ultimately results in loading the proxy into Apigee Edge. Some commonly used commands are:
* clean - remove the target directory
* copy-resources - copy the source files to the target applying any filtering or replacement
* package - copy the source files and bundle into zip file for deployment to Apigee
* install - copy, package and install into Apigee
* integration - run integration tests

## Git Commands

### Intitial
* git checkout -b prod
* git push origin prod
* git checkout master

### Feature
* git checkout -b feature/jira1 --- (MAKE changes for feature/jira1)

#### Test locally
Set your ~/.m2/settings.xml

### Maven $HOME/.m2/settings.xml 
```
<profile>
            <id>test</id>
            <properties>
                <env.APIGEE_ORG>yourorgname</env.APIGEE_ORG>
                <env.APIGEE_USERNAME>yourusername</env.APIGEE_USERNAME>
                <env.APIGEE_PASSWORD>yourpassword</env.APIGEE_PASSWORD>
                <env.APIGEE_NORTHBOUND_DOMAIN>yourorgname-test.apigee.net</env.APIGEE_NORTHBOUND_DOMAIN>
            </properties>
        </profile>
        <profile>
            <id>prod</id>
            <properties>
                <env.APIGEE_ORG>yourorgname</env.APIGEE_ORG>
                <env.APIGEE_USERNAME>yourusername</env.APIGEE_USERNAME>
                <env.APIGEE_PASSWORD>yourpassword</env.APIGEE_PASSWORD>
                <env.APIGEE_NORTHBOUND_DOMAIN>yourorgname-prod.apigee.net</env.APIGEE_NORTHBOUND_DOMAIN>
            </properties>
        </profile>
```

See commands at end.

Once you're happy with the "new" tests locally and verify the feature "doesn't work" in test and prod, then move on to building via Jenkins.

#### Test via Jenkins
* git commit -am  "Added changes for feature1"
* git push origin feature/jira1

If the build succeeds you're ready to move into the master branch.

#### Merge to Master
##### Pull Request
* Go to repo and create pull request from feature/jira1 to master
* Comment on pull request
* Do the merge pull request "Create a merge commit" or use command line

##### Via command line
* git checkout master
* git merge --no-ff feature/jira1
* git push

Clean up feature branch
* git branch -d feature/jira1
* git push origin --delete feature/jira1

Or using this:
* git push origin :feature/jira1

#### Update local Master
* git checkout master
* git pull

### Merge to Environments: prod

## Maven
### Jenkins Commands
The Jenkins build server runs Maven with this command for each of the feature branches. 
* mvn -X -Ptraining-test install -Ddeployment.suffix= -Dapigee.config.options=update -Dapigee.config.dir=target/resources/edge -Dapigee.config.exportDir=target/test/integration -Dapi.testtag=@health

## Other Miscellaneous Commands

### Frequently used commands
* mvn jshint:lint
* mvn -Ptraining-test exec:exec@apigeelint

* mvn -Ptraining-test exec:exec@unit

mvn -Ptest apigee-config:targetservers -Dapigee.config.options=update
mvn -Ptest apigee-config:developerapps -Dapigee.config.options=update
mvn -Ptest apigee-config:apiproducts -Dapigee.config.options=update
mvn -Ptest apigee-config:kvms -Dapigee.config.options=update
mvn -Ptest apigee-config:exportAppKeys -Dapigee.config.exportDir=./appkeys

## Bottom line

### Run process resources and run tests
* mvn -Ptraining-test process-resources -Ddeployment.suffix= apigee-config:exportAppKeys -Dapigee.config.dir=target/resources/edge -Dapigee.config.exportDir=target/test/integration exec:exec@integration -Dapi.testtag=@intg,@errors

#### Run tests after process resources
* node ./node_modules/cucumber/bin/cucumber.js target/test/integration/features --tags @errors

### All at once using resources dir, run health tests
Replacer copies and replaces the resources dir into the target. Note use of -Dapigee.config.dir and -Dapigee.config.exportDir options.

* mvn -P training-test install -Ddeployment.suffix= -Dapigee.config.options=update -Dapigee.config.dir=target/resources/edge -Dapigee.config.exportDir=target/test/integration -Dapi.testtag=@intg

