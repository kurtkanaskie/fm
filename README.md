# fm-v1
Multiple API proxies, shared flows
mvn -P training-test process-resources -Ddeployment.suffix= -Dskip.clean=true exec:exec@integration -Dapi.testtag=@health
This doesnt work:
mvn -P training-test process-resources -Ddeployment.suffix= apigee-config:exportAppKeys -Dapigee.config.dir=./target/resources/edge -Dapigee.config.exportDir=./target/test/integration exec:exec@integration -Dapi.testtag=@get-ping
