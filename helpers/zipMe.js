 
   import fs from 'fs';
   import archiver  from 'archiver';
   
   /**
     * to zip a specified folder in specified destination 
     * @return json with success and bytes data
     * @param {*} source source of a folder to be zipped
     * @param {*} destination destination where to be zipped
     */

    const zipMe = (source, destination) => {
        new Promise((resolve, reject) => {
            let output = fs.createWriteStream(destination);
            let archive = archiver('zip', {
                zlib: {
                    level: 9
                }
            });
            output.on('close', function () {
                console.log(archive.pointer() + ' total bytes');
                console.log('archiver has been finalized and the output file descriptor has closed.');
                resolve({
                    success: true,
                    bytes: archive.pointer()
                })
            });
            archive.on('warning', function (err) {
                reject(err);
            });
            //throwing error so that to be notified in slack
            archive.on('error', function (err) {
                reject(err);
            });
            archive.pipe(output);
            archive.directory(source, '/');
            archive.finalize();
        })
    }
    
    
    
    export default zipMe;
    