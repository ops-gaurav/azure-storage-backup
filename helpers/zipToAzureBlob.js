
/**
 * function to store zip files to azure bob container
 * @return Boolean 
 * @param {*} blobService blob service to read/write blobs in azure
 * @param {*} container name of container where blob will be saved
 * @param {*} blobLabel blob name
 * @param {*} destination local file path to saved in blob-azure 
 */
const zipToAzureBlob = ({blobService, container='container', blobLabel='blob', destination})=>
new Promise((resolve, reject)=>{ console.log(container,blobLabel, destination);
    blobService.createContainerIfNotExists(container, function(error, result, response) {
      if (error) reject(error);
      blobService.createBlockBlobFromLocalFile(container, blobLabel, destination, function(error, result, response){
        if(error)reject(error);
        if (result)resolve(response.isSuccessful);
      });
    })
})

export default zipToAzureBlob;