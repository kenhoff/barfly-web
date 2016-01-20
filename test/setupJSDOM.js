console.log("setting up jsdom...");
var jsdom = require('jsdom');
global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.window.localStorage = {
	getItem: function() {},
	setItem: function() {}
}

// grabbed from http://jaketrent.com/post/testing-react-with-jsdom/

// take all properties of the window object and also attach it to the
// mocha global object
propagateToGlobal(global.window)

// from mocha-jsdom https://github.com/rstacruz/mocha-jsdom/blob/master/index.js#L80
function propagateToGlobal(window) {
	for (key in window) {
		if (!window.hasOwnProperty(key)) continue
		if (key in global) continue

		global[key] = window[key]
	}
}

console.log("done setting up jsdom");
