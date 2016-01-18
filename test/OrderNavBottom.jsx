var assert = require('chai').assert;
var sinon = require('sinon');

var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');
var ShallowTestUtils = require('react-shallow-testutils');

var OrderNavBottom = require('../js/OrderNavBottom.jsx');

// console.log("isElement:", ReactTestUtils.isElement(result));
// console.log("isElementOfType nav:", ReactTestUtils.isElementOfType(result, "nav"));
// console.log("isDOMComponent:", ReactTestUtils.isDOMComponent(component));
// console.log("isCompositeComponent:", ReactTestUtils.isCompositeComponent(component));
// console.log("isCompositeComponentWithType OrderNavBottom:", ReactTestUtils.isCompositeComponentWithType(component, OrderNavBottom));

describe("OrderNavBottom", function() {
	before(function() {
		shallowRenderer = ReactTestUtils.createRenderer()
	})
	it("renders by default, without any props", function(done) {
		shallowRenderer.render(< OrderNavBottom />)
		result = shallowRenderer.getRenderOutput()
		component = ShallowTestUtils.getMountedInstance(shallowRenderer)
		assert(ReactTestUtils.isElementOfType(result, "nav"))
		done()
	})
	it("when called with disabled = false, renders", function(done) {
		shallowRenderer.render(< OrderNavBottom />)
		result = shallowRenderer.getRenderOutput()
		component = ShallowTestUtils.getMountedInstance(shallowRenderer)
		assert(ReactTestUtils.isElementOfType(result, "nav"))
		done()

	})
	it("when called wtih disabled = true, just renders an empty div", function(done) {
		shallowRenderer.render(< OrderNavBottom disabled = {
			true
		} />)
		result = shallowRenderer.getRenderOutput()
		component = ShallowTestUtils.getMountedInstance(shallowRenderer)
		assert(ReactTestUtils.isElementOfType(result, "div"))
		assert(!result.props.children);
		done()
	})
	it('calls this.props.sendOrder when "Send Order" button is clicked')
})
