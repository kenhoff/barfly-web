var React = require('react'); // eslint-disable-line no-unused-vars
var sinon = require('sinon');
var assert = require('chai').assert;
var ReactTestUtils = require('react-addons-test-utils');
var Provider = require('react-redux').Provider;
var createStore = require('redux').createStore;

var $ = require('jquery');

var rewire = require('rewire');
var ProductCard = rewire("../jsx/Order/ProductCard.jsx");

var DistributorField = React.createClass({
	render: function() {
		return (<div/>);
	}
});
var RepField = React.createClass({
	render: function() {
		return (<div/>);
	}
});
var SizeList = React.createClass({
	render: function() {
		return (<div/>);
	}
});

// rewireify set stuff

ProductCard.__set__("DistributorField", DistributorField);
ProductCard.__set__("RepField", RepField);
ProductCard.__set__("SizeList", SizeList);

var renderedProductCard;
var title;
var distributorFieldComponent;
var repFieldComponent;
var repFields;
var sizeListComponent;
var sizeLists;
// var consoleStub;

var renderProductCard = function(jsx) {
	renderedProductCard = ReactTestUtils.renderIntoDocument(jsx);
	getComponents(renderedProductCard);
	return renderedProductCard;
};

var getComponents = function(mainComponent) {
	title = ReactTestUtils.scryRenderedDOMComponentsWithTag(mainComponent, "p")[0];
	distributorFieldComponent = ReactTestUtils.findRenderedComponentWithType(mainComponent, DistributorField);
	repFieldComponent = function() {
		repFields = ReactTestUtils.scryRenderedComponentsWithType(mainComponent, RepField);
		if (repFields.length >= 1) {
			return repFields[0];
		} else {
			return null;
		}
	}();
	sizeListComponent = function() {
		sizeLists = ReactTestUtils.scryRenderedComponentsWithType(mainComponent, SizeList);
		if (sizeLists.length >= 1) {
			return sizeLists[0];
		} else {
			return null;
		}
	}();
};

describe("ProductCard", function() {
	beforeEach(function() {
		sinon.stub($, "ajax").yieldsTo("success", {
			"id": 2,
			"productName": "Product X",
			"productSizes": []
		});
		renderedProductCard = renderProductCard((
			<Provider store={createStore(function() {
				return {};
			}, {})}>
				<ProductCard barID={1} productID={2} searchText=""/>
			</Provider>
		));
	});
	afterEach(function() {
		$.ajax.restore();
	});

	// // stupid shitty console.error isn't stubbing or something
	// it.skip("throws an error if neither a productID or barID is provided", function() {
	// 	consoleStub = sinon.stub(console, "error");
	// 	renderedProductCard = renderProductCard(< ProductCard />);
	// 	// console.log(consoleStub.callCount);
	// });
	it.skip("throws an error if a productID is provided, but a barID isn't provided");
	it.skip("throws an error if a barID is provided, but a productID isn't provided");
	it.skip("does not throw an error if a productID and barID are provided");

	describe("if everything is provided", function() {
		it("renders a panel", function(done) {
			assert(ReactTestUtils.findRenderedDOMComponentWithClass(renderedProductCard, "panel"));
			done();
		});
		it.skip("renders the correct product name", function(done) {
			assert.equal(title.children[0].innerHTML, "Product X");
			done();
		});
	});
	describe("distributor/rep availability", function() {
		it("renders a distributor field by default", function(done) {
			assert(distributorFieldComponent);
			done();
		});
		describe.skip("if a distributor is not found", function() {
			beforeEach(function() {
				renderedProductCard.handleDistributorChange(null, null);
				getComponents(renderedProductCard);
			});
			it("does not display a rep field", function(done) {
				assert(!repFieldComponent);
				done();
			});
			it("does not display a size list", function(done) {
				assert(!sizeListComponent);
				done();
			});
		});
		describe.skip("if a distributor is found", function() {
			beforeEach(function() {
				renderedProductCard.handleDistributorChange(100, "Distributor Y");
				getComponents(renderedProductCard);

			});
			it("renders a rep field by default", function(done) {
				assert(repFieldComponent);
				done();
			});
			describe("if a rep is not found", function() {
				beforeEach(function() {
					renderedProductCard.handleRepChange(null, null);
					getComponents(renderedProductCard);
				});
				it("does not render a size list", function(done) {
					assert(!sizeListComponent);
					done();
				});
			});
			describe("if a rep is found", function() {
				beforeEach(function() {
					renderedProductCard.handleRepChange(200, "Rep Z");
					getComponents(renderedProductCard);
				});
				it("renders a size list", function(done) {
					assert(sizeListComponent);
					done();
				});
			});
		});
	});
});
