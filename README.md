# Microsoft Azure Storage Account Backup
[![npm](https://img.shields.io/npm/dt/azure-storage-backup.svg)](https://www.npmjs.com/package/azure-storage-backup) <br/>
[![NPM](https://nodei.co/npm/azure-storage-backup.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/azure-storage-backup/)<br/>
![Azure](http://www.newhorizons.com/portals/278/Images/MSAzure.png "Logo Title Text 1"){: width=200px}

azure-storage-backup is an npm module to generate the azure storage backups. Primarily this was designed to do BLOB storage backups, but it now also supports Table storage backups. In order to use this plugin, you need to have an Azure account. You need to create a storage account and need to have the access keys for the same. 

> 1. Require node >= 4.4.5
> 2. The plugin is using Promises rather than callbacks.
> 3. In order to use Table services. Both accounts needs to be <b>General Purpose Account</b>. That is defined at the time of creating a storage account.

## Usage
1. Install using the following command<br/>
`npm install --save azure-storage-backup`
2. You can perform backups through two ways.
	1. Static Backups: Recommended only one storage account needs to be backed up. This type of backup could be configured by setting up a configuration file and passing that configuration module to backup the container.
	2. Dynamic Backups: Recommended when more than one containers needs to be backed up. <strike>The automated backup for this mode is W.I.P but we can back it up manually by iterating over the list of containers and sending a new config file for each backup system.</strike> System have been implemented with whole account backup functionality. The example below shows how you can take backup of whoule Azure storage account using a single function call.
	
	> Following is the config file structure accepted by azure-copy-blob
	>```
	>{
	>	source: {
	>		serviceEndpoint: '',
	>		account: '',
	>		accessKey: '',
	>		connectionString: '',
	>		container: '',
	>		sasServiceParams: ''
	>	},
	>
	>	target: {
	>		serviceEndpoint: '',
	>		account: '',
	>		accessKey: '',
	>		connectionString: '',
	>		container: ''
	>	}
	>}
	>```
3. Define this configuration in a file say, `AzureConfig.js` and add the following code
```
	module.exports = {
		//...structure of config JSON
	}
```
4. Calling the copy API.
```
var AzureConfig = require('../config/AzureConfig.js');
var AzureStorage = require ('azure-storage-backup)(AzureConfig);

// ... Code goes here

/*
* This will backup whole storage account into the target account
*/
AzureStorage.triggerWholeAccountBackup()
	.then (success => console.log ('backed up!))
	.catch (err => console.log (err))

// .. rest of the code goes here
```

## Config file format
The config file contains the URLs, Signatures and API keys.
### Demystifying config file properties
1. `source` property contains the source container properties from where we want to backup data. 
2. `target` property contains the target/ backup storage container properties where we want to backup data.

`serviceEndpoint`: This represents the storage type service endpoint. It is a URL that you can find from the storage account and navigating to Blob from where you want to generate backup.<br/>
`account`: This represents the name of the storage account.<br/>
`accessKey`: This is the key you can find in  the Access Keys section of the storage account that you are willing to backup.<br/>
`connectionString`: This is the connection string that you will find along with `accessKey` in Access Keys section of your storage account.<br/>
`container`: The name of the container that you want to backup blobs from.<br/>
`sasServiceParams`: This is the key that is required when you are backing up or accesssing the private blobs. SAS abbrivated as Shared Access Signature is used to access the private storages. The SAS tends to expire after certain time depends upon the time you provide at the time of creating SAS key. You can generate SAS key from Shared Access Signature section of the storage account. 
> If your backup keeps failing, this might be because your SAS signature has expired. Try regenrating one or check the time stamps in the signature itself. You can always regenrate SAS keys, in case they expires. 

```
{
	source: {
		serviceEndpoint: '',
		account: '',
		accessKey: '',
		connectionString: '',
		container: '',
		sasServiceParams: ''
	},

	target: {
		serviceEndpoint: '',
		account: '',
		accessKey: '',
		connectionString: '',
		container: '',
		sasServiceParams: ''
	}
}
```

## Development and contribution
Feel free to pull and raise issues [here](https://github.com/sharma02gaurav/azure-copy-blob/issues).
### Testing
In order to run unit tests in your system, you have to define a `.env` file in the application root directory. The `.env` file contains all the relevant properties to be defined in config used by node-copy-blob. The following example shows a sample `.env` file.
```
SOURCE_ENDPOINT=<source-endpoint-url> 
SOURCE_ACCOUNT=<storage-account>
SOURCE_ACCESS_KEY=<source-access-key>
SOURCE_CONNECTION_STRING=<source-connection-string>
SOURCE_CONTAINER=<source-storage-container>
SOURCE_SAS_SIGNATURE=<source-sas-signature>

TARGET_ENDPOINT=<target-endpoint-url>
TARGET_ACCOUNT=<target-account>
TARGET_ACCESS_KEY=<target-access-key>
AccountName=<target-account-name>
TARGET_CONTAINER=<target-container-name>

```

## Links
* [azure-storage-node](https://github.com/Azure/azure-storage-node)
* [Microsoft Azure Storage SDK for Node.js](http://azure.github.io/azure-storage-node/)
* [Issues Tracking](https://github.com/sharma02gaurav/azure-copy-blob/issues)


## Contact
[sharma02gaurav@gmail.com](mailto:sharma02gaurav@gmail.com)
