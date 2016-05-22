if (process.env.NODE_ENV != "production") {
	require('dotenv').load();
}

var InlineEnviromentVariablesPlugin = require('inline-environment-variables-webpack-plugin');

module.exports = {
	entry: __dirname + "/jsx/Main.jsx",
	output: {
		path: __dirname + "/static",
		filename: "app.js"
	},
	module: {
		loaders: [{
			test: /\.jsx?$/,
			exclude: /(node_modules|bower_components)/,
			loader: 'babel', // 'babel-loader' is also a legal name to reference
			query: {
				presets: ['es2015']
			}
		}, {
			test: /.json$/,
			loader: "json"
		}]
	},
	plugins: [
		new InlineEnviromentVariablesPlugin(process.env)
	]
};
