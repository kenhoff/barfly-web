var assert = require('chai').assert;
var sinon = require('sinon');

var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');
var ShallowTestUtils = require('react-shallow-testutils');

var OrderNavBottom = require("../jsx/Order/OrderNavBottom.jsx")

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
	describe("if props.sending = true", function() {
		beforeEach(function() {
			sendOrderSpy = sinon.spy()

			renderedOrderNavBottom = renderOrderNavBottom(< OrderNavBottom disabled = {
				false
			}
			sending = {
				true
			}
			sendOrder = {
				sendOrderSpy
			} />)
			submitButton = ReactTestUtils.findRenderedDOMComponentWithTag(renderedOrderNavBottom, "button")
		})
		afterEach(function () {

		})
		it("button is active", function(done) {
			assert(submitButton.className.includes('active'));
			done()
		})
		it("button text is 'Sending order...'", function(done) {
			assert.equal(submitButton.innerHTML, "Sending order...")
			done()
		})
		it("clicking on button does nothing", function(done) {
			ReactTestUtils.Simulate.click(submitButton)
			assert.equal(sendOrderSpy.callCount, 0)
			done()
		})
	})
	describe("if props.sending = false", function() {
		beforeEach(function() {
			sendOrderSpy = sinon.spy()

			renderedOrderNavBottom = renderOrderNavBottom(< OrderNavBottom disabled = {
				false
			}
			sending = {
				false
			}
			sendOrder = {
				sendOrderSpy
			} />)
			submitButton = ReactTestUtils.findRenderedDOMComponentWithTag(renderedOrderNavBottom, "button")
		})
		it("button is not active", function(done) {
			assert(!submitButton.className.includes('active'));
			done()
		})
		it("button text is 'Send Order'", function(done) {
			assert.equal(submitButton.innerHTML, "Send Order")
			done()
		})
		it('clicking on button sends order', function(done) {
			ReactTestUtils.Simulate.click(submitButton)
			assert.equal(sendOrderSpy.callCount, 1)
			done()
		})
	})
})
