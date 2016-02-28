module.exports = {
	"env": {
		"browser": true,
		"node": true,
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
		"semi": [
			2,
			"never"
		],
		"react/jsx-uses-vars": 2,

	}
};
