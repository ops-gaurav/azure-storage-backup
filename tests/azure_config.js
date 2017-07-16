require ('dotenv').config();

var dummyConfig = {
	source: {
		serviceEndpoint: process.env.SOURCE_ENDPOINT,
		account: process.env.SOURCE_ACCOUNT,
		accessKey: process.env.SOURCE_ACCESS_KEY,
		connectionString: process.env.SOURCE_CONNECTION_STRING,
		container: process.env.SOURCE_CONTAINER,
		sasServiceParams: process.env.SOURCE_SAS_SIGNATURE
	},
	target: {
		serviceEndpoint: process.env.TARGET_ENDPOINT,
		account: process.env.TARGET_ACCOUNT,
		accessKey: process.env.TARGET_ACCESS_KEY,
		connectionString: process.env.TARGET_CONNECTION_STRING,
		container: process.env.TARGET_CONTAINER
	}
}

module.exports = dummyConfig;