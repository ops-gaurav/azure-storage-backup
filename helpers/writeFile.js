   import fs from 'fs';

   /**
     * function to write file in a given path with given content
     * @return Boolean 
     * @param {*} path files in provided path
     * @param {*} content data to written in file 
     */
    const writeFile = ({
        path,
        contents
    }) =>
    new Promise((resolve, reject) => {
        fs.writeFile(path, JSON.stringify(contents), (err) => {
            if (err) reject(err);
            resolve({success: true});
        });
    })



export default writeFile;
