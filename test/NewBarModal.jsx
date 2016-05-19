var React = require('react'); // eslint-disable-line no-unused-vars
var assert = require('assert');
var NewBarModal = require("../jsx/AppNav/NewBarModal.jsx");
var ReactTestUtils = require('react-addons-test-utils');
var Modal = require('react-bootstrap').Modal;
var Input = require('react-bootstrap').Input;
var $ = require('jquery');
var sinon = require('sinon');

// disclaimer - this is all bullshit. check https://github.com/react-bootstrap/react-bootstrap/blob/master/test/ModalSpec.js to see how to actually test these modals

var renderedComponent;
var buttons;

describe.skip("NewBarModal", function() {

	before(function() {
		sinon.stub(localStorage, "getItem").returns("asdfasdfasdf");
	});

	after(function() {
		localStorage.getItem.restore();
	});

	beforeEach(function() {
		renderedComponent = ReactTestUtils.renderIntoDocument(< NewBarModal showModal = {
			true
		} />);
	});

	it("renders a Modal", function(done) {
		assert(ReactTestUtils.isCompositeComponentWithType(renderedComponent.refs.NewBarModal, Modal));
		done();
	});

	it("has three buttons (one of them is the upper-right close button)", function(done) {
		buttons = ReactTestUtils.scryRenderedDOMComponentsWithTag(renderedComponent.refs.NewBarModal._modal, "button");
		assert(buttons.length == 3);
		done();
	});
	it("has two Input fields", function(done) {
		assert(ReactTestUtils.scryRenderedDOMComponentsWithTag(renderedComponent.refs.NewBarModal._modal, "input").length == 2);
		done();
	});
	it("trims whitespace on either side of the name when submitting", function(done) {

		var ajaxMock = sinon.mock($);
		var ajaxExpects = ajaxMock.expects("ajax");

		var submitSpy = sinon.spy(renderedComponent, "submitBar"); // make sure submitBar is at least clicked

		// set name to filled, zip to filled
		var barNameInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewBarModal._modal, Input)[0].getInputDOMNode();
		barNameInputNode.value = "	    \nKen's	super AWKWARD bar; name	    \n";
		ReactTestUtils.Simulate.change(barNameInputNode);
		var zipInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewBarModal._modal, Input)[1].getInputDOMNode();
		zipInputNode.value = "12345";
		ReactTestUtils.Simulate.change(zipInputNode);

		var submitButton = ReactTestUtils.scryRenderedDOMComponentsWithTag(renderedComponent.refs.NewBarModal._modal, "button")[2];
		ReactTestUtils.Simulate.click(submitButton);

		assert(!submitButton.className.includes("disabled"), "button is disabled!");
		assert(submitSpy.calledOnce, "submit wasn't called once");
		assert(ajaxExpects.calledWithMatch({
			url: process.env.BURLOCK_API_URL + "/user/bars"
		}), "didn't have right URL");
		assert(ajaxExpects.calledWithMatch({
			data: {
				barName: "Ken's	super AWKWARD bar; name",
				zipCode: "12345"
			}
		}), "didn't have right data");
		ajaxMock.restore();
		done();
	});
	it("zip code Input has the value '12345' when '12345' is entered", function(done) {
		var inputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewBarModal._modal, Input)[1].getInputDOMNode(); // get the DOM node
		inputNode.value = "12345"; // give the node a new value
		ReactTestUtils.Simulate.change(inputNode); // send an onChange event
		assert.equal(inputNode.value, "12345");
		done();
	});
	it("zip code Input has the value '67890' when '678900' is entered", function(done) {
		var inputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewBarModal._modal, Input)[1].getInputDOMNode();
		inputNode.value = "678900";
		ReactTestUtils.Simulate.change(inputNode);
		assert.equal(inputNode.value, "67890");
		done();
	});
	it("zip code Input has the value '' when 'asdfasdfasdf' is entered", function(done) {
		var inputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewBarModal._modal, Input)[1].getInputDOMNode();
		inputNode.value = "asdfasdfasdf";
		ReactTestUtils.Simulate.change(inputNode);
		assert.equal(inputNode.value, "");
		done();
	});
	it("zip code Input has the value '12345' when 'a1s2d3f4a5sdf' is entered", function(done) {
		var inputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewBarModal._modal, Input)[1].getInputDOMNode();
		inputNode.value = "a1s2d3f4a5sdf";
		ReactTestUtils.Simulate.change(inputNode);
		assert.equal(inputNode.value, "12345");
		done();
	});
	it("zip code Input has the value '12345' when ' 1 2 3 4 5 ' is entered", function(done) {
		var inputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewBarModal._modal, Input)[1].getInputDOMNode();
		inputNode.value = " 1 2 3 4 5 ";
		ReactTestUtils.Simulate.change(inputNode);
		assert.equal(inputNode.value, "12345");
		done();
	});
	it("zip code Input has the value '12345' when '-12345' is entered", function(done) {
		var inputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewBarModal._modal, Input)[1].getInputDOMNode();
		inputNode.value = "-12345";
		ReactTestUtils.Simulate.change(inputNode);
		assert.equal(inputNode.value, "12345");
		done();
	});
	it("trims whitespace on either side of the zip code", function(done) {
		var inputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewBarModal._modal, Input)[1].getInputDOMNode();
		inputNode.value = "	    12345	    ";
		ReactTestUtils.Simulate.change(inputNode);
		assert.equal(inputNode.value, "12345");
		done();
	});
	it("won't let you click submit if name and zip are empty", function(done) {
		var ajaxSpy = sinon.spy($, "ajax"); // make sure ajax isn't called
		var submitSpy = sinon.spy(renderedComponent, "submitBar"); // make sure submitBar is at least clicked

		// set both inputs to empty
		var barNameInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewBarModal._modal, Input)[0].getInputDOMNode();
		barNameInputNode.value = "";
		ReactTestUtils.Simulate.change(barNameInputNode);
		var zipInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewBarModal._modal, Input)[1].getInputDOMNode();
		zipInputNode.value = "";
		ReactTestUtils.Simulate.change(zipInputNode);

		var submitButton = ReactTestUtils.scryRenderedDOMComponentsWithTag(renderedComponent.refs.NewBarModal._modal, "button")[2];
		ReactTestUtils.Simulate.click(submitButton);

		assert(submitButton.className.includes("disabled"), "button isn't disabled!");
		assert(ajaxSpy.callCount == 0, "ajax was called");
		assert(submitSpy.calledOnce, "submit wasn't called once");
		$.ajax.restore();
		renderedComponent.submitBar.restore();
		done();
	});
	it("won't let you click submit if name is filled, but zip code is empty", function(done) {
		var ajaxSpy = sinon.spy($, "ajax"); // make sure ajax isn't called
		var submitSpy = sinon.spy(renderedComponent, "submitBar"); // make sure submitBar is at least clicked

		// set name to filled, zip to empty
		var barNameInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewBarModal._modal, Input)[0].getInputDOMNode();
		barNameInputNode.value = "asdfasdfasdfasdf";
		ReactTestUtils.Simulate.change(barNameInputNode);
		var zipInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewBarModal._modal, Input)[1].getInputDOMNode();
		zipInputNode.value = "";
		ReactTestUtils.Simulate.change(zipInputNode);

		var submitButton = ReactTestUtils.scryRenderedDOMComponentsWithTag(renderedComponent.refs.NewBarModal._modal, "button")[2];
		ReactTestUtils.Simulate.click(submitButton);

		assert(submitButton.className.includes("disabled"), "button isn't disabled!");
		assert(ajaxSpy.callCount == 0, "ajax was called");
		assert(submitSpy.calledOnce, "submit wasn't called once");
		$.ajax.restore();
		renderedComponent.submitBar.restore();
		done();
	});
	it("won't let you click submit if name is empty, but zip code is filled", function(done) {
		var ajaxSpy = sinon.spy($, "ajax"); // make sure ajax isn't called
		var submitSpy = sinon.spy(renderedComponent, "submitBar"); // make sure submitBar is at least clicked

		// set name to empty, zip to filled
		var barNameInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewBarModal._modal, Input)[0].getInputDOMNode();
		barNameInputNode.value = "";
		ReactTestUtils.Simulate.change(barNameInputNode);
		var zipInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewBarModal._modal, Input)[1].getInputDOMNode();
		zipInputNode.value = "12345";
		ReactTestUtils.Simulate.change(zipInputNode);

		var submitButton = ReactTestUtils.scryRenderedDOMComponentsWithTag(renderedComponent.refs.NewBarModal._modal, "button")[2];
		ReactTestUtils.Simulate.click(submitButton);

		assert(submitButton.className.includes("disabled"), "button isn't disabled!");
		assert(ajaxSpy.callCount == 0, "ajax was called");
		assert(submitSpy.calledOnce, "submit wasn't called once");
		$.ajax.restore();
		renderedComponent.submitBar.restore();
		done();
	});
	it("does let you click submit if both name and zip code are filled", function(done) {

		sinon.stub($, "ajax");

		var submitSpy = sinon.spy(renderedComponent, "submitBar"); // make sure submitBar is at least clicked

		// set name to filled, zip to filled
		var barNameInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewBarModal._modal, Input)[0].getInputDOMNode();
		barNameInputNode.value = "asdfasdfasdf";
		ReactTestUtils.Simulate.change(barNameInputNode);
		var zipInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewBarModal._modal, Input)[1].getInputDOMNode();
		zipInputNode.value = "12345";
		ReactTestUtils.Simulate.change(zipInputNode);

		var submitButton = ReactTestUtils.scryRenderedDOMComponentsWithTag(renderedComponent.refs.NewBarModal._modal, "button")[2];
		ReactTestUtils.Simulate.click(submitButton);

		assert(!submitButton.className.includes("disabled"), "button is disabled!");
		assert(submitSpy.calledOnce, "submit wasn't called once");
		$.ajax.restore();
		renderedComponent.submitBar.restore();
		done();
	});
	it("makes a request to /user/bars with the inputs when 'submit' is clicked", function(done) {
		var ajaxMock = sinon.mock($);
		var ajaxExpects = ajaxMock.expects("ajax");
		var submitSpy = sinon.spy(renderedComponent, "submitBar"); // make sure submitBar is at least clicked

		// set name to filled, zip to filled
		var barNameInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewBarModal._modal, Input)[0].getInputDOMNode();
		barNameInputNode.value = "asdfasdfasdf";
		ReactTestUtils.Simulate.change(barNameInputNode);
		var zipInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewBarModal._modal, Input)[1].getInputDOMNode();
		zipInputNode.value = "12345";
		ReactTestUtils.Simulate.change(zipInputNode);

		var submitButton = ReactTestUtils.scryRenderedDOMComponentsWithTag(renderedComponent.refs.NewBarModal._modal, "button")[2];
		ReactTestUtils.Simulate.click(submitButton);

		assert(!submitButton.className.includes("disabled"), "button is disabled!");
		assert(submitSpy.calledOnce, "submit wasn't called once");
		assert(ajaxExpects.calledWithMatch({
			url: process.env.BURLOCK_API_URL + "/user/bars"
		}), "didn't have right URL");
		assert(ajaxExpects.calledWithMatch({
			data: {
				barName: "asdfasdfasdf",
				zipCode: "12345"
			}
		}), "didn't have right data");

		ajaxMock.restore();
		done();
	});
});
