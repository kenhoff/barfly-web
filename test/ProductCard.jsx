var assert = require('chai').assert;

var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');

var ProductCard = require('../js/ProductCard.jsx');

renderProductCard = function() {
	ReactTestUtils.renderIntoDocument(< ProductCard />)
}

describe("ProductCard", function() {

	beforeEach(function() {
		renderedProductCard = renderProductCard()
	})

	it("doesn't render anything if a productID isn't provided")
	it("doesn't render anything if a barID isn't provided")
	describe("if everything is provided", function() {
		it("renders a panel")
		it("renders the correct product name")
	})
	describe("distributor/rep availability", function() {
		describe("if there's no distributor for this product in this zip code", function() {
			it("displays 'no distributor found'")
		})
		describe("if there's no rep found for this bar with this distributor", function() {
			it("if there's no rep found for this bar with this distributor, displays 'no rep found'")
		})
		describe("if there is a distributor for this product in this zide code", function() {
			it("displays the distributor name")
		})
		describe("if there is a rep found for this bar with this distributor", function() {
			it("displays the rep name")
		})
	})
})
