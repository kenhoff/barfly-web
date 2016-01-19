var assert = require('assert');

var NewBarModal = require('../js/NewBarModal.jsx');
var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');
var Modal = require('react-bootstrap').Modal;
var Input = require('react-bootstrap').Input;

// disclaimer - this is all bullshit. check https://github.com/react-bootstrap/react-bootstrap/blob/master/test/ModalSpec.js to see how to actually test these modals

describe("NewBarModal", function() {

	beforeEach(() => {
		mountPoint = document.createElement('div');
		document.body.appendChild(mountPoint);
	});

	afterEach(() => {
		ReactDOM.unmountComponentAtNode(mountPoint);
		document.body.removeChild(mountPoint);
	});

	it("renders a Modal", function(done) {
		renderedComponent = ReactDOM.render(< NewBarModal showModal = {
			true
		} />, mountPoint)
		assert(ReactTestUtils.isCompositeComponentWithType(renderedComponent.refs.NewBarModal, Modal))
		done()
	})

	it("has three buttons?!?!?!?!", function(done) {
		renderedComponent = ReactTestUtils.renderIntoDocument(< NewBarModal showModal = {
			true
		} />)
		buttons = ReactTestUtils.scryRenderedDOMComponentsWithTag(renderedComponent.refs.NewBarModal._modal, "button")
		assert(buttons.length == 3)
		done()
	})
	it("has two Input fields", function(done) {
		renderedComponent = ReactTestUtils.renderIntoDocument(< NewBarModal showModal = {
			true
		} />)
		assert(ReactTestUtils.scryRenderedDOMComponentsWithTag(renderedComponent.refs.NewBarModal._modal, "input").length == 2)
		done()
	})
	it("zip code Input has the value '12345' when '12345' is entered", function (done) {
		renderedComponent = ReactTestUtils.renderIntoDocument(< NewBarModal showModal = {
			true
		} />)
		// before that, we need to start firing some events at the input element
		inputComponent =  ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewBarModal._modal, Input)[1].getInputDOMNode()
		inputComponent.value = "12345"
		// let's work backwards - first, get the value of the actual input element
		resultValue = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewBarModal._modal, Input)[1].getValue()
		assert.equal(resultValue, "12345")
		done()
	})
	it.skip("zip code Input has the value '67890' when '678900' is entered", function (done) {
		renderedComponent = ReactTestUtils.renderIntoDocument(< NewBarModal showModal = {
			true
		} />)
		// before that, we need to start firing some events at the input element
		inputComponent =  ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewBarModal._modal, Input)[1].getInputDOMNode()
		inputComponent.value = "678900"
		// let's work backwards - first, get the value of the actual input element
		resultValue = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewBarModal._modal, Input)[1].getValue()
		assert.equal(resultValue, "67890")
		done()
	})
	it("zip code Input has the value '' when 'asdfasdfasdf' is entered")
	it("zip code Input has the value '12345' when 'a1s2d3f4a5sdf' is entered")
	it("zip code Input has the value '12345' when ' 1 2 3 4 5 ' is entered")
	it("trims whitespace on either side of the name")
	it("trims whitespace on either side of the zip code")
	it("won't let you click submit if name is empty")
	it("won't let you click submit if zip code is empty")
	it("makes a request to /user/bars when 'submit' is clicked")
})
