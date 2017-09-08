
/**
 * provides all data from  from a provided azure acount's tables
 * @param {*} tableService table service to read/write in azure tables
 * @param {*} tableName name of the table
 
 */
const queryEntities = ({tableService,tableName,query = null,currentToken = null,options = null}) =>
new Promise((resolve, reject) =>
    tableService.queryEntities(tableName, query, currentToken, options, (err, queryResultContinuation, response) => {
        if (err) reject(err);
        else resolve(response.body.value);
    })
)
export default queryEntities;