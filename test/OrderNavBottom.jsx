var assert = require('chai').assert;
var sinon = require('sinon');

var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');
var ShallowTestUtils = require('react-shallow-testutils');

var OrderNavBottom = require('../js/OrderNavBottom.jsx');

renderOrderNavBottom = function(component) {
	renderedOrderNavBottom = ReactTestUtils.renderIntoDocument(component)
	return renderedOrderNavBottom
}

describe("OrderNavBottom", function() {
	it("renders by default, without any props", function(done) {
		renderedOrderNavBottom = renderOrderNavBottom(< OrderNavBottom />)
		nav = ReactTestUtils.findRenderedDOMComponentWithTag(renderedOrderNavBottom, "nav")
		assert(nav)
		done()
	})
	it("when called with disabled = false, renders", function(done) {
		renderedOrderNavBottom = renderOrderNavBottom(< OrderNavBottom disabled = {
			false
		} />)
		nav = ReactTestUtils.findRenderedDOMComponentWithTag(renderedOrderNavBottom, "nav")
		assert(nav)
		done()
	})
	it("when called with disabled = true, just renders an empty div", function(done) {
		renderedOrderNavBottom = renderOrderNavBottom(< OrderNavBottom disabled = {
			true
		} />)
		navs = ReactTestUtils.scryRenderedDOMComponentsWithTag(renderedOrderNavBottom, "nav")
		assert.equal(navs.length, 0)
		done()
	})
	it('calls this.props.sendOrder when "Send Order" button is clicked', function(done) {
		sendOrderSpy = sinon.spy()
		renderedOrderNavBottom = renderOrderNavBottom(< OrderNavBottom disabled = {
			false
		}
		sendOrder = {
			sendOrderSpy
		} />)
		submitButton = ReactTestUtils.findRenderedDOMComponentWithTag(renderedOrderNavBottom, "button")
		ReactTestUtils.Simulate.click(submitButton)
		assert.equal(sendOrderSpy.callCount, 1)
		done()
	})
})
