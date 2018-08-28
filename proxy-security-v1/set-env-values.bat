@echo off
echo BRANCH: %BUILD_SOURCEBRANCHNAME%

REM This will be either featurename, master, qa, stage, sandbox or prod
set branch=%BUILD_SOURCEBRANCHNAME%

REM If branch is master or feature set EdgeEnv to "dev"
REM If branch is feature set EdgeDeploySuffix to featurename

if %branch% == master set branch=dev

set EdgeEnv=%branch%
set EdgeDeploySuffix=
REM if not a standard branch then its a feature branch and set EdgeEnv to devs and et EdgeDeploySuffix to featurename
if not %branch% == dev if not %branch% == qa if not %branch% == stage if not %branch% == sandbox if not %branch% == prod set EdgeEnv=dev & set EdgeDeploySuffix=%branch% & echo its feature

echo EdgeEnv: %EdgeEnv%
echo EdgeDeploySuffix: %EdgeDeploySuffix%

@echo ##vso[task.setvariable variable=EdgeEnv]%EdgeEnv%
@echo ##vso[task.setvariable variable=EdgeDeploySuffix]%EdgeDeploySuffix%
