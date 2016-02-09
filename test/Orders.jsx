React = require("react")
ReactTestUtils = require("react-addons-test-utils")
var chai = require('chai');
var assert = chai.assert;
var $ = require('jquery');
var sinon = require('sinon');
var ReactDOM = require('react-dom');

Orders = require("../js/Orders.jsx")
var OrderCard = require('../js/OrderCard.jsx');

var History = require('react-router').History;

renderOrders = function() {
	renderedOrders = ReactTestUtils.renderIntoDocument(< Orders bar = {
		12345
	} />)
	newOrderButton = ReactTestUtils.findRenderedDOMComponentWithTag(renderedOrders, "button")
	return renderedOrders
}

describe("Orders", function() {
	beforeEach(function() {
		sinon.stub($, "ajax").yieldsTo("success", [
			2,
			3,
			8,
			1,
			9,
			10,
			4,
			5,
			6,
			7,
			0
		])
		renderedOrders = renderOrders()
	})
	afterEach(function() {
		$.ajax.restore()
	})
	it("renders a h1 with 'Orders'", function(done) {
		assert(ReactTestUtils.findRenderedDOMComponentWithTag(renderedOrders, "h1"))
		done()
	})
	it("when given a list of unsorted orders, sorts the orders before rendering them", function(done) {
		orderCards = ReactTestUtils.scryRenderedComponentsWithType(renderedOrders, OrderCard)
		// because orders are shown in descending order (10...1) need to hack the iteration a bit
		correctOrderCards = [
			10,
			9,
			8,
			7,
			6,
			5,
			4,
			3,
			2,
			1,
			0
		]
		for (var i = 0; i < orderCards.length; i++) {
			assert.equal(orderCards[i].props.order, correctOrderCards[i])
		}
		done()
	})
	// actually have to skip this one right now too. history gets populated by the router - which means that even though we have the history mixin 
	it.skip("when 'new order' is clicked, navigate into order with new ID", function (done) {
		$.ajax.restore()
		sinon.stub($, "ajax").yieldsTo("success", 100)
		ReactTestUtils.Simulate.click(newOrderButton)
	})
})