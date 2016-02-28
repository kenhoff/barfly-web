module.exports = {
	"env": {
		"browser": true,
		"commonjs": true,
		"es6": true
	},
	"extends": ["eslint:recommended"],
	"parserOptions": {
		"ecmaFeatures": {
			"experimentalObjectRestSpread": true,
			"jsx": true
		}
	},
	"plugins": [
		"react"
	],
	"rules": {
		"indent": [
			2,
			"tab"
		],
		"linebreak-style": [
			2,
			"unix"
		],
		// "quotes": [
		// 	2,
		// 	"double"
		// ],
		"semi": [
			2,
			"never"
		],
		"react/jsx-uses-vars": 2,
		"no-process.env": 0
	}
};
