var assert = require('chai').assert;

var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');
var ShallowTestUtils = require('react-shallow-testutils');

var OrderNavBottom = require('../js/OrderNavBottom.jsx');

describe("OrderNavBottom", function() {
	before(function () {
		shallowRenderer = ReactTestUtils.createRenderer()
	})
	it("renders by default, without any props", function () {
		shallowRenderer.render(<OrderNavBottom />)
		result = shallowRenderer.getRenderOutput()
		component = ShallowTestUtils.getMountedInstance(shallowRenderer)
		console.log("isElement:", ReactTestUtils.isElement(result));
		console.log("isElementOfType nav:", ReactTestUtils.isElementOfType(result, "nav"));
		console.log("isDOMComponent:", ReactTestUtils.isDOMComponent(component));
		console.log("isCompositeComponent:", ReactTestUtils.isCompositeComponent(component));
		console.log("isCompositeComponentWithType OrderNavBottom:", ReactTestUtils.isCompositeComponentWithType(component, OrderNavBottom));
	})
	it("when called with disabled = false, renders")
	it("when called wtih disabled = true, just renders an empty div")
	it('calls this.props.sendOrder when "Send Order" button is clicked')
})
