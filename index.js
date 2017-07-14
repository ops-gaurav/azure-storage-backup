import AzureStorage from 'azure-storage';

let exports = module.exports = {};

/**
 * @desc trigger the Blob Storage back up AZURE API
 * @param {Object} config representing the source and target configurations of the AZURE BLOB storage
 * @return {Promise}
 */
exports.triggerBackupBlobStorage = config => {
	return new Promise ((resolve, reject) => {
		let sourceBlobService = AzureStorage.createBlobService (config.source.account, config.source.accessKey);
		
		if (sourceBlobService) {

			let targetBlobService = AzureStorage.createBlobService (config.target.account, config.target.accessKey);

			if (targetBlobService) {

				sourceBlobService.listBlobsSegmented (config.source.container, null, (err, blobs, response) => {
					if (err) reject (err);
					else if (response && response.body) {
						
						let blobs = response.body.EnumerationResults.Blobs.Blob;
						let blobNames = [];

						targetBlobService.createContainerIfNotExists (config.target.container, (err, result, response) => {
							if (!err) {
								// console.log ();
								for (let i=0; i < blobs.length; i++) {
									var blob = blobs[i];

									let blobURI = sourceBlobService.getUrl (config.source.container, blob.Name, null, config.source.serviceEndpoint) + config.source.sasServiceParams;
									blobNames.push ({name: val.Name, URI: blobURI});

									// call the backup service to backup the current BLOB

									targetBlobService.startCopyBlob (blobURI, config.target.container, 'backup_'+ val.Name, (err, blob, response) => {
										if (err){  
											reject (err);
										} 
									});

									if (i == blobs.length-1)
										resolve ('Backed up '+ (i+1) +' blob(s)');

								}
							} else {
								reject (err);
							}
						})

					} else reject ('No response.')
				});

			} else {
				reject ('Connection with the target endpoint failed. Check configurations and signatures in the config object.');
			}

		} else {
			reject ('Connection with the source endpoint failed. Check configurations and signatures in the config object.');
		}
	});
}