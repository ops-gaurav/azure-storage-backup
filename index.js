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
		 * @desc trigger account backup. This by default backup all the containers in source account to
		 * the target account
		 * @returns {Promise} resolving and rejecting the request
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
		 * @returns {Promise} resolving and rejecting the request.
		 */
		triggerContainerBackup: (sourceContainer, targetContainer) => {
			return new Promise((resolve, reject) => {
				Azure.copyContainerBlobs(sourceContainer, targetContainer)
					.then(success => {
						resolve(success);
					}).catch(error => {
						reject(error);
					});
			});
		}

	}
};