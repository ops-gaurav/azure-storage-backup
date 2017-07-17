/**
 * @desc unit tests to test the package backup system.
 * @author gaurav
 */
import Chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import config from './azure_config';
import index from  '../index';
import assert from 'assert';

let expect = Chai.expect;
let waitTime = 30000;

Chai.use (chaiAsPromised);

/**
 * VERIFIED TEST? add skip to skip it
 * add describe.skip to all tests that you want to skip. (Units that already have been tested)
 */

describe ('**** AZURE COPY BLOB TESTS ****', function() {

	/**
	 * Test #1 to test the backup based upon the 
	 * container names from environment
	 * 
	 * don't use arrow functions because this.promise is not
	 * accessible with the arrow functions.
	 */
	describe ('Testing blobs backup in container', function() {
		this.timeout (waitTime);
		it ('will handle the container backup promise', done => {
			
			let resultPromise = index.triggerBackupBlobStorage (config);

			resultPromise.then (success => {
				expect (success).to.equal ('success');
				done();
			}).catch (err => {
				console.error (err);
				
				assert.fail (err);
				done();
			});
		})
	});

	/**
	 * Test #2 to test the account based backing up
	 * This will use the account name and will
	 * back up all the containers inside the storage account.
	 */
	describe.skip ('Testing container based backing up', function () {
		this.timeout (waitTime);

		it ('will handle the account backup promise', done => {
			let resultPromise = index.triggerBackupContainer(config);

			resultPromise.then (success => {
				expect (success).to.equal ('success');
				done();
			}).catch (error => {
				assert.fail (error);
				done();
			})
		})
	});
});