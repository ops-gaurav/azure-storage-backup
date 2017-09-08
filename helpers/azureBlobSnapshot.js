
/**
 * function to create snapshot of a blob
 * @return Boolean 
 * @param {*} blobService blob service to read/write blobs in azure
 * @param {*} container name of container where blob will be saved
 * @param {*} blobLabel blob name
 * @param {*} destination local file path to saved in blob-azure 
 */
const azureBlobSnapshot = ({blobService, container, blobLabel})=>
new Promise((resolve, reject)=>{ console.log(container); console.log(blobLabel);
   blobService.createBlobSnapshot(container, blobLabel, (error, result, response)=> {
     if (error) reject(error);
       resolve(result); 
    })
})

export default azureBlobSnapshot;