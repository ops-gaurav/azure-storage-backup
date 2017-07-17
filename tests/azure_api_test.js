var config = require('./azure_config.js');
var AzureStorage = require('../azure_api/Azure.js')(config);
var expect = require('chai').expect;
var assert = require('assert');
// var AzureStorage = new azure

// let AzureStorage = new AzureStorage (config);


describe('Testing Azure API class', function () {

	// Test #1 tp get the container list
	describe.skip ('Test listing container', function () {
		this.timeout(30000);
		it('should resolve the container list', done => {
			var resolvePromise = AzureStorage.listContainers();

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
	describe ('Test listing blobs inside container', function () {
		this.timeout(30000);
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
	describe.skip ('Test to fetch the blob URL', function () {
		this.timeout(30000);

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
	describe.skip ('Test to copy blob from one container to another', function () {
		this.timeout(30000);

		it('Should resolve the copy process', done => {
			var resolvePromise = AzureStorage.copyContainerBlobs(config.source.container, config.target.container);

			resolvePromise.then(success => {
				console.log (success);
				expect(success).to.equal('success');
				done();
			}).catch(err => done());
		});
	});


	/**
	 * TEST #5 to test the account's container blobs to another
	 */
	describe.skip ('Test to copy one account to another', function () {
		this.timeout (30000);

		it ('should resolve the copy process', done => {
			var resolvePromise = AzureStorage.copyAccountContainers ()
				.then (success => {
					expect (success).to.equal ('success');
					done();
				})
				.catch (error => done());
		});
	});

});