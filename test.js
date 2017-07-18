var config = require ('./tests/azure_config.js');
var Azure = require ('./index.js')(config);

Azure.triggerWholeAccountBackup().then (success => {
	console.log (success);
}).catch (err => {
	console.log (err);
})