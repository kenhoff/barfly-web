module.exports = {
	"env": {
		"browser": true,
		"node": true,
		"commonjs": true,
		"es6": true,
		"mocha": true
	},
	"extends": ["eslint:recommended"],
	"parserOptions": {
		"ecmaFeatures": {
			"experimentalObjectRestSpread": true,
			"jsx": true
		},
		"sourceType": "module"
	},
	"plugins": [
		"react"
	],
	"rules": {
		"indent": [
			2,
			"tab", {
				"SwitchCase": 1
			}
		],
		"linebreak-style": [
			2,
			"unix"
		],
		"semi": [
			2,
			"always"
		],
		"quotes": [2, "double"],
		"quote-props": [2, "consistent-as-needed"],
		"react/jsx-uses-vars": 2,
		"jsx-quotes": [2, "prefer-double"],
		"no-console": 1
	}
};
