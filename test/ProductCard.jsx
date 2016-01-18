var assert = require('chai').assert;

var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');

var ProductCard = require('../js/ProductCard.jsx');

describe("ProductCard", function() {
	shallowRenderer = ReactTestUtils.createRenderer()
	shallowRenderer.render(<ProductCard productID = {1} barID = "2" />)
	result = shallowRenderer.getRenderOutput()
	it("is actually a react element", function (done) {
		assert(ReactTestUtils.isElement(result));
		done()
	})
})
