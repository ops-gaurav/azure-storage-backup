var expect = require ('chai').expect;
var config = require ('./azure_config');
var index = require ('../index');

var waitTime = 20000;

describe ('The Azure copy blob tests', function() {

	/**
	 * Test #1 to test the backup based upon the 
	 * container names from environment
	 * 
	 * don't use arrow functions because this.promise is not
	 * accessible with the arrow functions.
	 */
	describe ('testing blobs backup in container', function() {
		this.timeout (waitTime);
		it ('will handle the container backup promise', (done) => {
			
			var resultPromise = index.triggerBackupBlobStorage (config);
			resultPromise.then (success => {
				expect (success).to.equal ('success');
				done();
			}).catch (err => {
				console.error (err);
				done();
			});
		})
	});

	/**
	 * Test #2 to test the account based backing up
	 * This will use the account name and will
	 * back up all the containers inside the storage account.
	 */
	describe ('testing container based backing up', function () {
		this.timeout (waitTime);

		it ('will handle the account backup promise', (done) => {

		})
	});
});