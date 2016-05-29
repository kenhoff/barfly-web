if (process.env.NODE_ENV != "production") {
	require('dotenv').load();
}

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
