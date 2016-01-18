var assert = require('assert');

var NewBarModal = require('../js/NewBarModal.jsx');
var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');
var Modal = require('react-bootstrap').Modal;
var Input = require('react-bootstrap').Input;

describe("NewBarModal", function() {
	it("renders a Modal", function(done) {
		renderedComponent = ReactTestUtils.renderIntoDocument(< NewBarModal />)
		assert(ReactTestUtils.findRenderedComponentWithType(renderedComponent, Modal))
		modalComponent = ReactTestUtils.findRenderedComponentWithType(renderedComponent, Modal)
		console.log(ReactTestUtils.findRenderedComponentWithType(modalComponent, Modal.Header));
		done()
	})
	it("has two Input fields", function() {
		renderedComponent = ReactTestUtils.renderIntoDocument(< NewBarModal />)
		// console.log(ReactTestUtils.scryRenderedComponentsWithType(renderedComponent, Input).length)
		assert(ReactTestUtils.scryRenderedComponentsWithType(renderedComponent, Input).length == 2)
		done()
	})
	it("zip code Input has the value '12345' when '12345' is entered")
	it("zip code Input has the value '67890' when '678900' is entered")
	it("zip code Input has the value '' when 'asdfasdfasdf' is entered")
	it("zip code Input has the value '12345' when 'a1s2d3f4a5sdf' is entered")
	it("zip code Input has the value '12345' when ' 1 2 3 4 5 ' is entered")
	it("trims whitespace on either side of the name")
	it("trims whitespace on either side of the zip code")
	it("won't let you click submit if name is empty")
	it("won't let you click submit if zip code is empty")
	it("makes a request to /user/bars when 'submit' is clicked")
})
