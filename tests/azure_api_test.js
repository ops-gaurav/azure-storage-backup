const config = require('./azure_config.js');
const AzureStorage = require('../azure_api/Azure.js')(config);
const expect = require('chai').expect;
const assert = require('assert');
const index = require('../index.js');

let timeout = 30000;


describe('Testing Azure API class', function () {

	// Test #1 tp get the container list
	describe.skip('Test listing container', function () {
		this.timeout(timeout);
		it('should resolve the container list', done => {
			const resolvePromise = AzureStorage.listContainers();

			resolvePromise.then(success => {
				// console.log (success);
				expect(success).to.be.an('array');
				done();
			}).catch(err => {
				// expect (err).to.not.be (undefined);
				done();
			});
		});
	});

	// TEST #2 to get the blobs list inside a container
	describe.skip('Test listing blobs inside container', function () {
		this.timeout(timeout);
		it('Should resolve the blobs list inside container', done => {
			var resolvePromise = AzureStorage.listBlobs('multusbackup');

			resolvePromise.then(success => {
				expect(success).to.be.an('array');
				done();
			}).catch(err => {
				done();
			});
		})
	});

	// TEST #3 to get the blob URL inside a container
	describe.skip('Test to fetch the blob URL', function () {
		this.timeout(timeout);

		it('Should resolve the blob URL bases on container and blob name', done => {
			var resolvePromise = AzureStorage.getBlobUrl('multusbackup', 'IMG_1038.JPG');

			resolvePromise.then(success => {
				expect(success).to.be.a('string');
				done();
			}).catch(err => {
				expect(err).to.equal('Cannot resolve URL');
				done();
			})
		});
	});

	// TEST #4 to test the container backup
	describe.skip('Test to copy blob from one container to another', function () {
		this.timeout(timeout);

		it('Should resolve the copy process', done => {
			var resolvePromise = AzureStorage.copyContainerBlobs(config.source.container, config.target.container);

			resolvePromise.then(success => {
				console.log(success);
				expect(success).to.equal('success');
				done();
			}).catch(err => done());
		});
	});


	/**
	 * TEST #5 to test the account's container blobs to another
	 */
	describe.skip('Test to copy one account to another', function () {
		this.timeout(timeout);

		it('should resolve the copy process', done => {
			var resolvePromise = AzureStorage.copyAccountContainers();

			resolvePromise.then(success => {
				expect(success).to.equal('success');
				done();
			}).catch(error => done());
		});
	});

	/****************************TABLE Tests********************* */

	/**
	 * TEST #6 to test the tables listing inside a storage account
	 */
	describe.skip('Test to tables listing under a storage account', function () {
		this.timeout(timeout);

		it('should resolve the listing process and return an array', done => {
			var resolvePromise = AzureStorage.listTables();

			resolvePromise.then(success => {
				expect(success).to.be.an('array');
				done();
			}).catch(err => {
				expect(err).to.equal(undefined);
				done()
			});
		});
	});

	// TEST #7 to query the table and list all items
	describe.skip('Test to query all enteries in a table', function () {
		this.timeout(timeout);

		it('should resolve the query process', done => {
			var resolvePromise = AzureStorage.tableQueryAll('testtable');

			resolvePromise.then(success => {
				assert(success).to.be.an('array');
				done();
			}).catch(err => {
				done();
			})
		})
	})

	/**
	 * UNIT TEST
	 * TEST #8 to copy one table into another
	 */
	describe.skip('Test to copy one table into another', function () {
		this.timeout(timeout);

		it('should resolve the copy process of one table into another', done => {
			var resolvePromise = AzureStorage.copyTable('testtable', 'backuptesttable');

			resolvePromise.then(success => {
				expect(success).to.be.a('string');
				expect(success).to.equal('success');

				done();
			}).catch(err => {
				console.log(err);
				done();
			});
		});
	})

	/**
	 * UNIT TEST
	 * TEST #9 to copy all the tables into another.
	 */
	describe.skip('Test to copy whole tables into another account', function () {
		this.timeout(timeout);

		it('should resolve the copy process of account tables into another account', done => {
			var resolvePromise = AzureStorage.copyAllTables()
				.then(success => {
					expect(success).to.be.a('string');
					expect(success).to.equal('success');

					done();
				}).catch(error => done());
		});
	});

});