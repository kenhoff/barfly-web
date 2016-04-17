var React = require('react');
var assert = require('assert');
var sinon = require('sinon');
var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');
var Modal = require('react-bootstrap').Modal;
var Input = require('react-bootstrap').Input;

var NewProductModal = require("../jsx/Order/NewProductModal.jsx");

// notes: for a bunch of these, we actually need to check to see if the disabled button is clicked, and handle accordingly

var renderNewProductModal = function() {
	renderedNewProductModal = ReactTestUtils.renderIntoDocument(< NewProductModal showModal = {
		true
	} />);
	productNameInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedNewProductModal.refs.NewProductModal._modal, Input)[0].getInputDOMNode();

	submitButton = ReactTestUtils.scryRenderedDOMComponentsWithTag(renderedNewProductModal.refs.NewProductModal._modal, "button")[2];
	return renderedNewProductModal;
};

describe("NewProductModal", function() {

	before(function() {
		sinon.stub(localStorage, "getItem").returns("asdfasdfasdf");
	});
	after(function() {
		localStorage.getItem.restore();
	});

	beforeEach(function() {
		sinon.stub($, "ajax").yieldsTo("success", [1, 2, 3]);
		renderedNewProductModal = renderNewProductModal();
	});

	afterEach(function() {
		$.ajax.restore();
	});

	it("renders a modal", function(done) {
		assert(ReactTestUtils.isCompositeComponentWithType(renderedNewProductModal.refs.NewProductModal, Modal));
		done();
	});
	describe("validate name input", function() {
		it("trims whitespace on either side of the name when submitted", function(done) {
			$.ajax.restore();

			ajaxMock = sinon.mock($);
			ajaxExpects = ajaxMock.expects("ajax");

			productNameInputNode.value = "	   \nasdfasdfasdf\n	   ";
			ReactTestUtils.Simulate.change(productNameInputNode);
			ReactTestUtils.Simulate.click(submitButton);

			assert(ajaxExpects.calledOnce, "ajax wasn't called once");
			assert(ajaxExpects.calledWithMatch({
				url: process.env.BURLOCK_API_URL + "/products"
			}), "didn't have right URL");
			assert(ajaxExpects.calledWithMatch({
				data: {
					productName: "asdfasdfasdf"
				}
			}), "didn't have right data");
			ajaxMock.restore();
			sinon.stub($, "ajax");
			done();
		});
	});
	describe("button enabled/disabled", function() {
		it("is disabled if 'name' input is empty", function(done) {
			$.ajax.restore();

			ajaxSpy = sinon.spy($, "ajax");
			submitProductSpy = sinon.spy(renderedNewProductModal, "submitProduct");

			productNameInputNode.value = "";
			ReactTestUtils.Simulate.change(productNameInputNode);

			ReactTestUtils.Simulate.click(submitButton);

			// button is (cosmetically) disabled
			assert(submitButton.className.includes("disabled"), "button isn't disabled!");
			// submitProduct is called
			assert(submitProductSpy.calledOnce);
			// ajax isn't called
			assert(ajaxSpy.callCount == 0, "ajax called");

			$.ajax.restore();
			sinon.stub($, "ajax");
			done();
		});

		it("is disabled if 'name' input is just white space", function(done) {
			$.ajax.restore();

			ajaxSpy = sinon.spy($, "ajax");
			submitProductSpy = sinon.spy(renderedNewProductModal, "submitProduct");

			productNameInputNode.value = "     	\n\n";
			ReactTestUtils.Simulate.change(productNameInputNode);

			ReactTestUtils.Simulate.click(submitButton);

			// button is (cosmetically) disabled
			assert(submitButton.className.includes("disabled"), "button isn't disabled!");
			// submitProduct is called
			assert(submitProductSpy.calledOnce);
			// ajax isn't called
			assert(ajaxSpy.callCount == 0, "ajax called");

			$.ajax.restore();
			sinon.stub($, "ajax");
			done();
		});
		it("clicking on enabled button makes a call to /products", function(done) {

			$.ajax.restore();

			ajaxSpy = sinon.spy($, "ajax");

			productNameInputNode.value = "asdfasdfasdf";
			ReactTestUtils.Simulate.change(productNameInputNode);

			ReactTestUtils.Simulate.click(submitButton);

			assert(ajaxSpy.calledOnce);
			assert(ajaxSpy.calledWithMatch({
				url: process.env.BURLOCK_API_URL + "/products"
			}), "incorrect URL");
			assert(ajaxSpy.calledWithMatch({
				data: {
					productName: "asdfasdfasdf"
				}
			}), "incorrect data");
			done();
		});
	});
});
