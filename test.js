var config = require ('./tests/azure_config.js');
var Azure = require ('./index.js')(config);

if (Azure.triggerBlobAccountBackup())
	console.log ('backed up');