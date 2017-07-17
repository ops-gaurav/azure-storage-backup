'use strict';

var az = require('azure-storage')

var self = this;
/**
 * self instantiates the azure object that populates the available options
 * with it. Invoking the consturctor will init the class with the sorce and target
 * service instance by default.
 * @param {Object} config represent the Azure Connection configurations 
 */
function AzureStorage(config) {
	self.config = config;
	self._azureBlobService = az.createBlobService(config.source.account, config.source.accessKey);
	self._azureTargetBlobServuce = az.createBlobService(config.target.account, config.target.accessKey);
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
	return new Promise((resolve, reject) => {
		self._azureBlobService.listBlobsSegmented(container, null, (err, blobs, response) => {
			if (err) {
				reject(err);
			} else if (response && response.body) {
				const { EnumerationResults: { Blobs: { Blob } } } = response.body;
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
						// self.getBlobUrl (container, blob.Name). then (success => {
						// 	blobNames.push ({
						// 		name: blob.Name,
						// 		URL: success
						// 	});
						// }).catch (err => reject (err));

						if (index == Blob.length - 1)
							resolve(blobNames);
					});
				} else if (Blob) {

					var URL = self._azureBlobService.getUrl(container, Blob.Name, null, self.config.source.serviceEndpoint) + self.config.source.sasServiceParams;
					if (URL) {
						blobNames.push({
							name: Blob.Name,
							URL: URL
						});
					}

					// json object -> contains one blob
					// self.getBlobUrl(container, Blob.Name).then(success => {
					// 	blobName.push({
					// 		name: Blob.Name,
					// 		URL: success
					// 	});

					// 	resolve(blobNames);
					// }).catch(err => reject(err));
				} else {
					resolve(blobNames);
				}

			}
		})
	});
};

/**
 * get the access URL for the selected BLOB
 * @param {string} container is the name of the container
 * @param {string} blob represents the name of the blob
 * @return {Promise} resolving the blobURL or rejecting 
 */
AzureStorage.prototype.getBlobUrl = (container, blob) => {
	return new Promise((resolve, reject) => {
		let URL = self._azureBlobService.getUrl(container, blob, null, self.config.source.serviceEndpoint) + self.config.source.sasServiceParams;

		if (URL)
			resolve(URL);
		else reject('Cannot resolve URL');

	});
}

/**
 * self will trigger the backup of container blobs represented by name containerName in the
 * source storage account to the target account with the name targetContainerName]
 * @param {string} containerName representing the source container name
 * @param {string} targetContainerName representing the target container name
 */
AzureStorage.prototype.copyContainerBlobs = (containerName, targetContainerName) => {
	self._azureBlobService.listBlobSegmented()
}

module.exports = config => new AzureStorage(config);