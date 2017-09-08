require ('dotenv').config();

const dummyConfig = {
	source: {
		account: process.env.SOURCE_ACCOUNT,
		accessKey: process.env.SOURCE_ACCESS_KEY,
		sasServiceParams: process.env.SOURCE_SAS_SIGNATURE
	},
	target: {
		account: process.env.TARGET_ACCOUNT,
		accessKey: process.env.TARGET_ACCESS_KEY
	}
}

module.exports = dummyConfig;