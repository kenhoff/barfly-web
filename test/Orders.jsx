var ReactTestUtils = require("react-addons-test-utils")
var chai = require('chai')
var assert = chai.assert
var $ = require('jquery')
var sinon = require('sinon')

var Orders = require("../js/Orders.jsx")
var OrderListItem = require('../js/OrderListItem.jsx')

var browserHistory = require('react-router').browserHistory

renderOrders = function() {
	renderedOrders = ReactTestUtils.renderIntoDocument(< Orders bar = {
		12345
	} />)
	newOrderButton = ReactTestUtils.findRenderedDOMComponentWithTag(renderedOrders, "button")
	return renderedOrders
}

describe("Orders", function() {
	beforeEach(function() {
		sinon.stub($, "ajax").onFirstCall().yieldsTo("success", [
			{
				id: 2,
				sent: true
			}, {
				id: 3,
				sent: true
			}, {
				id: 8,
				sent: true
			}, {
				id: 1,
				sent: true
			}, {
				id: 9,
				sent: true
			}, {
				id: 10,
				sent: true
			}, {
				id: 4,
				sent: true
			}, {
				id: 5,
				sent: true
			}, {
				id: 6,
				sent: true
			}, {
				id: 7,
				sent: true
			}, {
				id: 0,
				sent: true
			}
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
		OrderListItems = ReactTestUtils.scryRenderedComponentsWithType(renderedOrders, OrderListItem)
		// because orders are shown in descending order (10...1) need to hack the iteration a bit
		correctOrderListItems = [
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
		for (var i = 0; i < OrderListItems.length; i++) {
			assert.equal(OrderListItems[i].props.order.id, correctOrderListItems[i])
		}
		done()
	})
	it("when 'new order' is clicked, navigate into order with new ID", function(done) {
		$.ajax.restore()

		sinon.stub($, "ajax").yieldsTo("success", 100)
		browserHistoryMock = sinon.mock(browserHistory)
		browserHistoryExpect = browserHistoryMock.expects("push")

		ReactTestUtils.Simulate.click(newOrderButton)
		assert(browserHistoryExpect.once().withArgs("/orders/100"))
		browserHistory.push.restore()
		done()
	})
})
