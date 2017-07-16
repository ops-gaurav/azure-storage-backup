var AzureStorage = require('azure-storage');

var exports = module.exports = {};

/**
 * @desc trigger the Blob Storage back up AZURE API
 * @param {Object} config representing the source and target configurations of the AZURE BLOB storage
 * @return {Promise}
 */
exports.triggerBackupBlobStorage = config => {
	return new Promise((resolve, reject) => {
		let sourceBlobService = AzureStorage.createBlobService(config.source.account, config.source.accessKey);

		if (sourceBlobService) {

			let targetBlobService = AzureStorage.createBlobService(config.target.account, config.target.accessKey);

			if (targetBlobService) {

				if (config.source.container) {
					sourceBlobService.listBlobsSegmented(config.source.container, null, (err, blobs, response) => {
						if (err) reject(err);
						else if (response && response.body) {

							let blobs = response.body.EnumerationResults.Blobs.Blob;
							let blobNames = [];

							if (config.target.container) {
								targetBlobService.createContainerIfNotExists(config.target.container, (err, result, response) => {
									if (!err) {
										// console.log ();
										for (let i = 0; i < blobs.length; i++) {
											var blob = blobs[i];

											if (config.source.sasServiceParams) {
												let blobURI = sourceBlobService.getUrl(config.source.container, blob.Name, null, config.source.serviceEndpoint) + config.source.sasServiceParams;

												// console.log(blobURI);
												blobNames.push({
													name: blob.Name,
													URI: blobURI
												});

												// call the backup service to backup the current BLOB

												targetBlobService.startCopyBlob (blobURI, config.target.container, 'backup_' + blob.Name, (err, blob, response) => {

													console.log ('here');

													if (err) {
														reject(err);
													} else {
														console.log (blob.Name+ ' backed up.');
													}
												});

												if (i == blobs.length - 1) {
													console.log('Backed up ' + (i + 1) + ' blob(s)');
													resolve('success');
												}
											} else {
												reject('sasServiceParams not found for source in config.');
											}
										}
									} else {
										reject(err);
									}
								})
							} else reject('target container property not defined.');

						} else reject('No response.')
					});
				} else {
					reject('source container property is not defined in config.');
				}

			} else {
				reject('Connection with the target endpoint failed. Check configurations and signatures in the config object.');
			}

		} else {
			reject('Connection with the source endpoint failed. Check configurations and signatures in the config object.');
		}
	});
};

/**
 * @desc call this method to trigger backing up the whole blob container
 * @param {Object} config representing the Azure connection configurations including container name.
 * @return {Promise} that resolves or rejects the backup promise
 */
exports.triggerBackupContainer = config => {
	return new Promise((resolve, reject) => {
		let storageAccountConnection = AzureStorage.createBlobService(config.source.account, config.source.accessKey);

		if (storageAccountConnection) {
			storageAccountConnection.listContainersSegmented(undefined, config.options.containerOptions, (err, enteries, response) => {
				if (err) {
					reject(err);
				} else if (response && response.body) {


					// bind response.body.EnumerationResults.Containers.Container with const Container variable
					const {
						EnumerationResults: {
							Containers: {
								Container
							}
						}
					} = response.body;

					

				} else {
					reject('Error getting containers list.')
				}
			})
		} else {
			reject('Account not resolved.');
		}
	});
}