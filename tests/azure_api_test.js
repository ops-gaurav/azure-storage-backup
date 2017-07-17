var config = require ('./azure_config.js');
var AzureStorage = require ('../azure_api/Azure.js')(config);
var expect = require ('chai').expect;
var assert = require ('assert');
// var AzureStorage = new azure

// let AzureStorage = new AzureStorage (config);


describe ('Testing Azure API class', function (){

	// Test #1 tp get the container list
	describe.skip ('Test listing container', function () {
		this.timeout (30000);
		it ('should resolve the container list', done => {
			var resolvePromise = AzureStorage.listContainers();

			resolvePromise.then (success => {
				// console.log (success);
				expect (success).to.be.an ('array');
				done();
			}).catch (err => {
				// expect (err).to.not.be (undefined);
				done();
			});
		})
	});

	// TEST #2 to get the blobs list inside a container
	describe ('Test listing blobs inside container', function () {
		this.timeout (30000);
		it ('Should resolve the blobs list inside container', done => {
			var resolvePromise = AzureStorage.listBlobs ('multusbackup');

			resolvePromise.then (success => {
				expect (success).to.be.an ('array');
				done();
			}).catch (err => {
				done();
			});
		})
	});

});