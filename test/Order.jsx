var React = require('react'); // eslint-disable-line no-unused-vars
var ReactTestUtils = require("react-addons-test-utils");
var chai = require('chai');
var assert = chai.assert;
var $ = require('jquery');
var sinon = require('sinon');
var ReactDOM = require('react-dom');
var Provider = require('react-redux').Provider;
var createStore = require('redux').createStore;

var browserHistory = require('react-router').browserHistory;

var productCards;
var renderedOrder;
var ajaxStub;
var h1Tag;
var browserHistoryMock;
var browserHistoryExpect;

var Order = require("../jsx/Order/Order.jsx");
var ProductCard = require('../jsx/Order/ProductCard.jsx');
var bartender = require('../jsx/Bartender.jsx');

var store = createStore(function() {
	return {};
}, {});

bartender.store = store;

var renderOrder = function() {
	renderedOrder = ReactTestUtils.renderIntoDocument((
		<Provider store={store}>
			<Order bar={1} params={{
				orderID: 10
			}}/>
		</Provider>
	));
	productCards = ReactTestUtils.scryRenderedComponentsWithType(renderedOrder, ProductCard);
	return renderedOrder;
};

describe("Order", function() {
	beforeEach(function() {
		ajaxStub = sinon.stub($, "ajax");
		ajaxStub.onFirstCall().yieldsTo("success", [
			{
				productID: 3,
				productName: "Product C"
			}, {
				productID: 1,
				productName: "Product B"
			}, {
				productID: 2,
				productName: "Product A"
			}
		]);
		ajaxStub.onThirdCall().yieldsTo("success", {
			productOrders: [],
			sent: false
		});
		renderedOrder = renderOrder();
	});
	afterEach(function() {
		$.ajax.restore();
	});
	it("renders an h1 with the orderID at the top", function(done) {
		h1Tag = ReactTestUtils.findRenderedDOMComponentWithTag(renderedOrder, "h1");
		assert.equal(ReactDOM.findDOMNode(h1Tag).children[0].innerHTML, "Order #10 ");
		done();
	});

	it("sorts product list by name", function(done) {
		// proper order is 2, 1, 3
		assert.equal(productCards[0].props.productID, 2);
		assert.equal(productCards[1].props.productID, 1);
		assert.equal(productCards[2].props.productID, 3);
		done();
	});
	it.skip("on sendOrder, if 200, navigates to /orders", function(done) {
		window.Intercom = sinon.stub();

		$.ajax.restore();

		ajaxStub = sinon.stub($, "ajax");
		ajaxStub.yieldsTo("success");

		browserHistoryMock = sinon.mock(browserHistory);
		browserHistoryExpect = browserHistoryMock.expects("push");

		renderedOrder.sendOrder();

		assert(browserHistoryExpect.calledWith("/orders"));
		assert(browserHistoryExpect.calledOnce);
		browserHistory.push.restore();
		done();
	});
	it.skip("on sendOrder, if error, does not navigate to /orders", function(done) {
		$.ajax.restore();

		ajaxStub = sinon.stub($, "ajax");
		ajaxStub.yieldsTo("error");

		browserHistoryMock = sinon.mock(browserHistory);
		browserHistoryExpect = browserHistoryMock.expects("push");

		renderedOrder.sendOrder();

		assert.equal(browserHistoryExpect.callCount, 0);

		browserHistory.push.restore();
		done();
	});

});
