if (process.env.NODE_ENV != "production") {
	require("dotenv").load();
}

if (process.env.NODE_ENV != "production") {
	var sourceMap = "cheap-module-eval-source-map";
} else {
	sourceMap = "";
}

var InlineEnviromentVariablesPlugin = require("inline-environment-variables-webpack-plugin");

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
			loader: "babel", // 'babel-loader' is also a legal name to reference
			query: {
				presets: ["react", "es2015"]
			}
		}, {
			test: /.json$/,
			loader: "json"
		}]
	},
	plugins: [
		new InlineEnviromentVariablesPlugin(process.env)
	],
	devtool: sourceMap
};
