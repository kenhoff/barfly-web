React = require("react")
ReactTestUtils = require("react-addons-test-utils")
var chai = require('chai');
var assert = chai.assert;
var $ = require('jquery');
var sinon = require('sinon');
var ReactDOM = require('react-dom')

Order = require("../js/Order.jsx")

renderOrder = function() {
	renderedOrder = ReactTestUtils.renderIntoDocument(< Order bar = {
		1
	}
	params = {
		{
			orderID: 10
		}
	} />)
	return renderedOrder
}

describe("Order", function() {
	beforeEach(function() {
		sinon.stub($, "ajax").yieldsTo("success", [
		])
		renderedOrder = renderOrder()
	})
	it("renders an h1 with the orderID at the top", function(done) {
		h1Tag = ReactTestUtils.findRenderedDOMComponentWithTag(renderedOrder, "h1")
		assert.equal(ReactDOM.findDOMNode(h1Tag).children[0].innerHTML, "Order #");
		assert.equal(ReactDOM.findDOMNode(h1Tag).children[1].innerHTML, "10");
		done()
	})

	// might just end up testing this later. seems like we might need to refactor the Order component a bit.
	it("sorts product list by name")
})
