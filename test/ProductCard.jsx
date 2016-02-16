var sinon = require('sinon');
var assert = require('chai').assert;

var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');

var ProductCard = require('../js/ProductCard.jsx');

renderProductCard = function(jsx) {
	renderedProductCard = ReactTestUtils.renderIntoDocument(jsx)
	title = ReactTestUtils.scryRenderedDOMComponentsWithTag(renderedProductCard, "p")[0]
	return renderedProductCard
}

describe("ProductCard", function() {
	beforeEach(function() {
		sinon.stub($, "ajax").yieldsTo("success", {
			"id": 2,
			"productName": "Product X",
			"productSizes": []
		})
		renderedProductCard = renderProductCard(< ProductCard barID = {
			1
		}
		productID = {
			2
		} />)
	})
	afterEach(function() {
		$.ajax.restore()
	})

	// stupid shitty console.error isn't stubbing or something
	it.skip("throws an error if neither a productID or barID is provided", function(done) {
		consoleStub = sinon.stub(console, "error")
		renderedProductCard = renderProductCard(< ProductCard />)
		console.log(consoleStub.callCount)
	})
	it.skip("throws an error if a productID is provided, but a barID isn't provided")
	it.skip("throws an error if a barID is provided, but a productID isn't provided")
	it.skip("does not throw an error if a productID and barID are provided")


	describe("if everything is provided", function() {
		it("renders a panel", function(done) {
			assert(ReactTestUtils.findRenderedDOMComponentWithClass(renderedProductCard, "panel"))
			done()
		})
		it("renders the correct product name", function(done) {
			assert.equal(title.children[2].innerHTML, "Product X")
			done()
		})
	})
	describe("distributor/rep availability", function() {
		describe("if there's no disributor found", function() {
			it("displays 'no distributor found'")
			it("does not display a rep field")
			it("does not display a size list")
		})
		describe("if there is a distributor", function() {
			it("displays the distributor name")
			describe("if there's no rep", function() {
				it("displays 'no rep found'")
				it("does not display a size list")
			})
			describe("if there is a rep", function() {
				it("displays the rep name")
				it("displays a size list")
			})
		})
	})
})
