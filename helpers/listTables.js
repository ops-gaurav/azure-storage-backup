/**
 * lists all tables from a provided azure acount
 * @param {*} tableService table service to read/write in azure tables
 * @param {*} currentToken current token for previous fetch records
 * @param {*} options optional 
 */
const listTables = ({
    tableService,
    currentToken = null,
    options = null
}) =>
new Promise((resolve, reject) =>
    tableService.listTablesSegmented(currentToken, options, (err, entries, response) => {
        if (err) reject(err);
        else resolve(entries.entries);
    })
)

export default listTables;