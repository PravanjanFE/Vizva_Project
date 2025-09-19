# Vizva Cloud Functions

This repository contains the cloud functions of Vizva. Moralis package added to devDependencies. However, this package is not at all required for cloud functions. Adding the following code will help to get the function definitions in VS Code. 

``` 
const { default: Moralis } = require("moralis/types");
```

* Note: Remove this import before updating the cloud server.

## Upload to Cloud Server

```
 moralis-admin-cli watch-cloud-folder --moralisApiKey apiKeyhere  --moralisApiSecret apiSecrethere --autoSave 1 --moralisCloudfolder cloudFunctions
```
* Note: Install moralis-admin-cli globally

## Get Server Logs
```
moralis-admin-cli get-logs --moralisApiKey qoPYMWGZtMBFAkO --moralisApiSecret 8P11mUWy0FEejdc
```