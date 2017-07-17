'use strict';

const az = require('azure-storage');
const Batch = require('batch');

let batch = new Batch();

var self = this;
/**
 * self instantiates the azure object that populates the available options
 * with it. Invoking the consturctor will init the class with the sorce and target
 * service instance by default.
 * @param {Object} config represent the Azure Connection configurations 
 */
function AzureStorage (config) {
	self.config = config;
	self._azureBlobService = az.createBlobService(config.source.account, config.source.accessKey);
	self._azureTargetBlogService = az.createBlobService(config.target.account, config.target.accessKey);

	self._azureTableService = az.createTableService ();
}

/**
 * listing the container under the provided storage account.
 * @return {Promise} containing list of container names under the provided account.
 * If resolved, then promise will return the array of containers otherwise rejection with error message.
 */
AzureStorage.prototype.listContainers = () => {
	return new Promise((resolve, reject) => {
		self._azureBlobService.listContainersSegmented(undefined, null, (err, containers, response) => {

			if (err)
				reject(err);
			else if (response && response.body) {
				// console.log (response);
				let containersList = [];

				const { EnumerationResults: { Containers: { Container } } } = response.body;

				// console.log (Container);
				if (Container && Container.length) {
					// array -> contains multiple containers
					Container.forEach(container => containersList.push(container.Name));
				} else if (Container) {
					// single container -> contains single container
					containersList.push(Container.Name);
				}
				resolve(containersList);
			}
		});
	});
}

/**
 * get the list of blobs under the container
 * @param {string} container represents the name of the container.
 * @return {Promise} resolving or rejecting the blobs listing.
 */
AzureStorage.prototype.listBlobs = container => {
	// console.log (container);
	return new Promise((resolve, reject) => {
		self._azureBlobService.listBlobsSegmented(container, null, (err, blobs, response) => {
			if (err) {
				reject(err);
			} else if (response && response.body) {
				const { EnumerationResults: { Blobs: { Blob } } } = response.body;

				// console.log (Blob);listBlobs

				let blobNames = [];
				if (Blob && typeof Blob.length == 'number') {
					// array -> contains more than one blob
					Blob.forEach((blob, index) => {
						var URL = self._azureBlobService.getUrl(container, blob.Name, null, self.config.source.serviceEndpoint) + self.config.source.sasServiceParams;
						if (URL) {
							blobNames.push({
								name: blob.Name,
								URL: URL
							});
						}
						if (index == Blob.length - 1) {
							resolve(blobNames);
						}
					});
				} else if (Blob) {
					var URL = self._azureBlobService.getUrl(container, Blob.Name, null, self.config.source.serviceEndpoint) + self.config.source.sasServiceParams;
					if (URL) {
						blobNames.push({
							name: Blob.Name,
							URL: URL
						});
					}
					resolve(blobNames);
				} else {
					// console.log('resolved blob names');
					resolve(blobNames);
				}
			} else {
				reject('no response');
			}
		})
	});
};

/**
 * get all the blobs under the container in the target account
 * @param {string} container represents the name of the container
 */
AzureStorage.prototype.listTargetBlobs = container => {
	return new Promise((resolve, reject) => {
		self._azureTargetBlogService.listBlobsSegmented(container, null, (err, blobs, response) => {
			if (err) {
				reject(err);
			} else if (response && response.body) {
				const { EnumerationResults: { Blobs: { Blob } } } = response.body;

				let blobNames = [];
				if (Blob && typeof Blob.length == 'number') {
					// arrray -> multiple blobs
					Blob.forEach((blob, index) => {
						AzureStorage.prototype.getBlobUrl(container, blob.Name, true)
							.then(success => {
								blobNames.push({
									name: blob.Name,
									URL: success
								});
							}).catch(error => {
								reject(error)
							});

						if (index == Blob.length - 1)
							resolve(blobNames);
					});
				} else if (Blob) {
					// single documents
					AzureStorage.prototype.getBlobUrl(container, Blob.Name, true)
						.then(success => {
							blobNames.push({
								name: Blob.Name,
								URL: success
							});
							resolve(blobNames);
						}).catch(err => reject(err));
				}
			}
		})
	});
}

/**
 * get the access URL for the selected BLOB
 * @param {string} container is the name of the container
 * @param {string} blob represents the name of the blob
 * @param {boolean} target representing whether getting the uRL from target or source container
 * @return {Promise} resolving the blobURL or rejecting 
 */
AzureStorage.prototype.getBlobUrl = (container, blob, target) => {
	return new Promise((resolve, reject) => {
		let URL = '';
		if (target)
			URL = self._azureTargetBlobService.getUrl(container, blob, null, self.config.target.serviceEndpoint) + self.config.target.sasServiceParams;
		else
			URL = self._azureBlobService.getUrl(container, blob, null, self.config.source.serviceEndpoint) + self.config.source.sasServiceParams;
		// console.log (URL);
		if (URL)
			resolve(URL);
		else reject('Cannot resolve URL');

	});
}

AzureStorage.prototype.copyBlob = (sourceURL, targetContainer) => {
	self._azureTargetBlogService.createContainerIfNotExists(targetContainerName, (err, result, response) => {
		if (err) {
			return false;
		} else {
			return true;
		}
	});
}

/**
 * self will trigger the backup of container blobs represented by name containerName in the
 * source storage account to the target account with the name targetContainerName]
 * @param {string} containerName representing the source container name
 * @param {string} targetContainerName representing the target container name
 */
AzureStorage.prototype.copyContainerBlobs = (containerName, targetContainerName) => {
	return new Promise((resolve, reject) => {
		AzureStorage.prototype.listBlobs(containerName).then(success => {
			// console.log ('calling after resolving blobs');
			if (!targetContainerName) {
				targetContainerName = 'backup' + new Date().getTime() + '' + containerName;
			}
			// console.log (targetContainerName);
			self._azureTargetBlogService.createContainerIfNotExists(targetContainerName, (err, result, response) => {

				if (err) {
					reject(err);
				} else {

					for (let i = 0; i < success.length; i++) {
						let blob = success[i];
						self._azureTargetBlogService.startCopyBlob(blob.URL, targetContainerName, 'backup_' + blob.name, (err, blob, response) => {
							if (err) {
								reject(err);
							}
						})

						if (i == success.length - 1) {
							// console.log('copy containers resolved');
							resolve('success');
						}
					}
				}
			});
		}).catch(err => {
			reject(err)
		});
	});
}

/**
 * copy whole account container 
 * @return {Promise} resolving or rejecting the account activity
 */
AzureStorage.prototype.copyAccountContainers = () => {
	return new Promise((resolve, reject) => {
		AzureStorage.prototype.listContainers().then(containers => {
			// console.log (containers);
			for (let i = 0; i < containers.length; i++) {
				var containerName = containers[i];

				AzureStorage.prototype.copyContainerBlobs(containerName, 'backup' + containerName)
					.then(message => {
						console.log(message);
						if (message !== 'success') {
							// console.log('rejected')
							reject('error');
						}

						if (i == containers.length - 1)
							resolve('success');
					}).catch(err => reject(err))
			}
			// containers.forEach((containerName, index) => {

			// });
		}).catch(err => reject(err));
	});
}

/**
 * call azure API to backup data from source table to target table
 * @param {string} sourceTableName represents the name of the table from source account
 * @param {string} targetTableName name of the table from target account
 */
AzureStorage.prototype.copyTable = (sourceTableName, targetTableName) => {
	
}

module.exports = config => new AzureStorage(config);