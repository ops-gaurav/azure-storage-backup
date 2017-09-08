import fs from 'fs';
import azure from 'azure-storage';
import moment from 'moment';
import rimraf from 'rimraf';
import listTables from './helpers/listTables.js';
import queryEntities from './helpers/queryEntities.js';
import writeFile from './helpers/writeFile.js';
import zipMe from './helpers/zipMe.js';
import zipToAzureBlob from './helpers/zipToAzureBlob.js';
import azureBlobSnapshot from './helpers/azureBlobSnapshot';

const timeStamp = moment().format("YYYY-MM-DD-HH:mm");
let tablePath = __dirname + '/tables';
let source = __dirname + '/tables/tablesFiles';
let destination = __dirname + '/tables/tableList.zip';
let blobName = 'tabledump-' + timeStamp;
let container = 'tabledump';
let retry = 0;



/**
 * @desc the main file that contains all the relevant public callback functions to 
 * trigger the azure callback request.
 * @author gaurav 
 */
// var AzureStorage = require('azure-storage');

// module.exports = config => {
// 	const Azure = require('./azure_api/Azure.js')(config);
// 	return {


// 		/**
// 		 * @desc trigger account backup. This by default backup all the containers in source account to
// 		 * the target account
// 		 * @returns {Promise} resolving and rejecting the request
// 		 */
// 		triggerBlobAccountBackup: () => Azure.copyAccountContainers(),

// 		/**
// 		 * @desc trigger to backup the container to another container
// 		 * @param {string} sourceContainer represents the name of source container to backup
// 		 * @param {string} targetContainer name of target container to backup to
// 		 * @returns {Promise} resolving and rejecting the request.
// 		 */
// 		triggerContainerBackup: (sourceContainer, targetContainer) => Azure.copyContainerBlobs(sourceContainer, targetContainer),


// 		/**
// 		 * @desc trigger to backup all tables inside the storage account. This will trigger to
// 		 * backup all the tables from source account to target account
// 		 * @returns {Promise} resolving or rejecting the backup process
// 		 */
// 		triggerAccountTablesBackup: () => Azure.copyAllTables (),


// 		/**
// 		 * @desc trigger to backup all the tables and blob under the storage account.
// 		 * @returns {Promise} resolving the succes backup
// 		 */
// 		triggerWholeAccountBackup: () => Azure.copyAccountContainers()
// 	}
// };


/**
 * 
 */ 

const printFiles = async(tables, tableService) => {
  let options = {payloadFormat: "application/json;odata=nometadata"};
  await Promise.all(tables.map(async(tableName) => {
    try {
      let contents = await queryEntities({tableService,tableName,query: null,currentToken: null,
        // options // we need metadata to get entities data while restore process
      })
      let path = `tables/tablesFiles/${tableName}.json`;
      await writeFile({
        path: path,
        contents
      })
    } catch (error) {
      deleteDir(tablePath)
    }
  }));
}


const backup = async(account, key, done) => {
  let accountName = account || process.env.STORAGE_NAME;
  let accountKey = key || process.env.STORAGE_KEY;
  const tableService = azure.createTableService(accountName, accountKey);
  const blobService = azure.createBlobService(accountName, accountKey);
  try {
    await createDirIfNotExist(tablePath);
    await createDirIfNotExist(source);
    const tables = await listTables({tableService});
    await printFiles(tables, tableService);
    await zipMe(source, destination);
    let completed = await zipToAzureBlob({blobService,container,blobLabel: blobName,destination});
    // the date-time value after creating a snapshot. Do we have to store somewhere?
    let snapShot = await azureBlobSnapshot({blobService,container,blobLabel: blobName});
    done(snapShot);
    if (snapShot) {
      deleteDir(tablePath);
    }
  } catch (error) {
    retry += 1;
    if (retry < 4) backup(accountName, accountKey);
    if (retry === 4)throw error;
    
  }
}
const createDirIfNotExist = dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, 757);
  }
}
const deleteDir = path => {
  rimraf(path, function () {
    console.log('done');
  });
}
export default backup
