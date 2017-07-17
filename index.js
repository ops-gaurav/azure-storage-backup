/**
 * @desc the main file that contains all the relevant public callback functions to 
 * trigger the azure callback request.
 * @author gaurav 
 */
// var AzureStorage = require('azure-storage');

var exports = module.exports = {};

module.exports = config => {
	var Azure = require('./azure_api/Azure.js')(config);
	return {


		/**
		 * @desc trigger account backup
		 */
		triggerBlobAccountBackup: () => {
			Azure.copyAccountContainers()
				.then(success => {
					return true;
				})
				.catch(err => {
					throw new Error(err);
					// return false;
				})
		},

		/**
		 * @desc trigger to backup the container to another container
		 * @param {string} sourceContainer represents the name of source container to backup
		 * @param {string} targetContainer name of target container to backup to
		 */
		triggerContainerBackup: (sourceContainer, targetContainer) => {
			return new Promise((resolve, reject) => {
				Azure.copyContainerBlobs(sourceContainer, targetContainer)
					.then(success => {
						resolve (success);
					}).catch (error => {
						reject (error);
					});
			});
		}

	}
};