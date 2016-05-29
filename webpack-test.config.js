if (process.env.NODE_ENV != "production") {
	require('dotenv').load();
}

// test env vars
process.env.BURLOCK_API_URL = "http://localhost:1310";
process.env.AUTH0_DOMAIN = "barfly-dev.auth0.com";
process.env.AUTH0_CLIENT_ID = "kPM1hw9tkIkYTeM74ouGHQwOtp51I1ri";


var InlineEnviromentVariablesPlugin = require('inline-environment-variables-webpack-plugin');
var RewirePlugin = require("rewire-webpack");

module.exports = {
	entry: __dirname + "/test/Main.jsx",
	output: {
		path: __dirname + "/test",
		filename: "test.js"
	},
	module: {
		loaders: [{
			test: /\.jsx?$/,
			exclude: /(node_modules|bower_components)/,
			loader: 'babel', // 'babel-loader' is also a legal name to reference
			query: {
				presets: ['react', 'es2015']
			}
		}, {
			test: /.json$/,
			loader: "json"
		}]
	},
	plugins: [
		new InlineEnviromentVariablesPlugin(process.env),
		new RewirePlugin()
	]
};
