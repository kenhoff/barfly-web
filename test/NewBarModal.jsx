var assert = require('assert');

var NewBarModal = require('../js/NewBarModal.jsx');
var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');
var Modal = require('react-bootstrap').Modal;
var Input = require('react-bootstrap').Input;

// disclaimer - this is all bullshit. check https://github.com/react-bootstrap/react-bootstrap/blob/master/test/ModalSpec.js to see how to actually test these modals

describe("NewBarModal", function() {

	beforeEach(function() {
		renderedComponent = ReactTestUtils.renderIntoDocument(< NewBarModal showModal = {
			true
		} />)
	})

	it("renders a Modal", function(done) {
		assert(ReactTestUtils.isCompositeComponentWithType(renderedComponent.refs.NewBarModal, Modal))
		done()
	})

	it("has three buttons (one of them is the upper-right close button)", function(done) {
		buttons = ReactTestUtils.scryRenderedDOMComponentsWithTag(renderedComponent.refs.NewBarModal._modal, "button")
		assert(buttons.length == 3)
		done()
	})
	it("has two Input fields", function(done) {
		assert(ReactTestUtils.scryRenderedDOMComponentsWithTag(renderedComponent.refs.NewBarModal._modal, "input").length == 2)
		done()
	})
	it("trims whitespace on either side of the name", function(done) {
		inputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewBarModal._modal, Input)[0].getInputDOMNode() // get the DOM node
		inputNode.value = "	    \nKen's	super AWKWARD bar; name	    \n" // give the node a new value
		ReactTestUtils.Simulate.change(inputNode) // send an onChange event
		assert.equal(inputNode.value, "Ken's	super AWKWARD bar; name")
		done()
	})
	it("zip code Input has the value '12345' when '12345' is entered", function(done) {
		inputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewBarModal._modal, Input)[1].getInputDOMNode() // get the DOM node
		inputNode.value = "12345" // give the node a new value
		ReactTestUtils.Simulate.change(inputNode) // send an onChange event
		assert.equal(inputNode.value, "12345")
		done()
	})
	it("zip code Input has the value '67890' when '678900' is entered", function(done) {
		inputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewBarModal._modal, Input)[1].getInputDOMNode()
		inputNode.value = "678900"
		ReactTestUtils.Simulate.change(inputNode)
		assert.equal(inputNode.value, "67890")
		done()
	})
	it("zip code Input has the value '' when 'asdfasdfasdf' is entered", function(done) {
		inputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewBarModal._modal, Input)[1].getInputDOMNode()
		inputNode.value = "asdfasdfasdf"
		ReactTestUtils.Simulate.change(inputNode)
		assert.equal(inputNode.value, "")
		done()
	})
	it("zip code Input has the value '12345' when 'a1s2d3f4a5sdf' is entered", function(done) {
		inputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewBarModal._modal, Input)[1].getInputDOMNode()
		inputNode.value = "a1s2d3f4a5sdf"
		ReactTestUtils.Simulate.change(inputNode)
		assert.equal(inputNode.value, "12345")
		done()
	})
	it("zip code Input has the value '12345' when ' 1 2 3 4 5 ' is entered", function(done) {
		inputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewBarModal._modal, Input)[1].getInputDOMNode()
		inputNode.value = " 1 2 3 4 5 "
		ReactTestUtils.Simulate.change(inputNode)
		assert.equal(inputNode.value, "12345")
		done()
	})
	it("zip code Input has the value '12345' when '-12345' is entered", function(done) {
		inputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewBarModal._modal, Input)[1].getInputDOMNode()
		inputNode.value = "-12345"
		ReactTestUtils.Simulate.change(inputNode)
		assert.equal(inputNode.value, "12345")
		done()
	})
	it("trims whitespace on either side of the zip code", function(done) {
		inputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewBarModal._modal, Input)[1].getInputDOMNode()
		inputNode.value = "	    12345	    "
		ReactTestUtils.Simulate.change(inputNode)
		assert.equal(inputNode.value, "12345")
		done()
	})
	it("won't let you click submit if name and zip are empty")
	it("won't let you click submit if name is filled, but zip code is empty")
	it("won't let you click submit if name is empty, but zip code is filled")
	it("does let you click submit if both name and zip code are filled")
	it("makes a request to /user/bars when 'submit' is clicked")
})
