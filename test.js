var config = require ('./tests/azure_config.js');
var Azure = require ('./azure_api/Azure.js')(config);

Azure.copyAccountContainers ()
	.then (success => console.log (success))
	.catch (error => console.log (error));
