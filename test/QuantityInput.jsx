sinon = require("sinon")
React = require("react")
ReactTestUtils = require("react-addons-test-utils")
var ReactDOM = require('react-dom');
Input = require("react-bootstrap").Input
Button = require("react-bootstrap").Button
var assert = require('assert');

var QuantityInput = require('../js/QuantityInput.jsx');

describe("QuantityInput", function() {
	renderQuantityInput = function(quantity) {

		changeQuantitySpy = sinon.spy()

		renderedQuantityInput = ReactTestUtils.renderIntoDocument(< QuantityInput sizeID = {
			10
		}
		quantity = {
			quantity
		}
		changeQuantity = {
			changeQuantitySpy
		} />)

		inputComponent = ReactTestUtils.findRenderedComponentWithType(renderedQuantityInput, Input)
		stepperButtons = ReactTestUtils.scryRenderedComponentsWithType(renderedQuantityInput, Button)
		label = ReactTestUtils.findRenderedDOMComponentWithTag(renderedQuantityInput, "label")

		return renderedQuantityInput
	}

	beforeEach(function() {
		sinon.stub($, "ajax").yieldsTo("success", {sizeName: "750ml"})
		renderedQuantityInput = renderQuantityInput(100)
	})

	afterEach(function() {
		$.ajax.restore()
	})

	it("renders an Input", function(done) {
		assert(ReactTestUtils.isCompositeComponentWithType(inputComponent, Input))
		done()
	})
	it("renders an input with two button addons", function(done) {
		assert.equal(stepperButtons.length, 2)
		done()
	})
	it("has a label with the right size name", function(done) {
		assert.equal(label.children[0].innerHTML, "750ml");
		done()
	})
	describe("if a quantity isn't provided", function() {
		beforeEach(function() {
			renderedQuantityInput = renderQuantityInput()
		})
		it("the input value is empty", function(done) {
			assert(!inputComponent.getValue())
			done()
		})
	})
	describe("if the quantity provided is 0", function() {
		beforeEach(function() {
			renderedQuantityInput = renderQuantityInput(0)
		})
		it("the input value is empty", function(done) {
			assert(!inputComponent.getValue())
			done()
		})
		it("clicking the '-' stepper doesn't do anything", function(done) {
			ReactTestUtils.Simulate.click(ReactDOM.findDOMNode(stepperButtons[0]))
			assert.equal(changeQuantitySpy.callCount, 0)
			done()
		})
		it("clicking the '+' stepper calls changeQuantity with quantity: 1", function(done) {
			ReactTestUtils.Simulate.click(ReactDOM.findDOMNode(stepperButtons[1]))
			assert(changeQuantitySpy.calledWith(1), "changeQuantity not called with correct args")
			done()
		})
	})
	describe("if the quantity provided is 1", function() {
		beforeEach(function() {
			renderedQuantityInput = renderQuantityInput(1)
		})
		it("the input value is 1", function(done) {
			assert.equal(inputComponent.getValue(), 1)
			done()
		})
		it("clicking the '-' stepper calls changeQuantity with 0", function(done) {
			ReactTestUtils.Simulate.click(ReactDOM.findDOMNode(stepperButtons[0]))
			assert(changeQuantitySpy.calledWith(0), "changeQuantity not called with correct args")
			done()
		})
		it("clicking the '+' stepper calls changeQuantity with quantity: 2", function(done) {
			ReactTestUtils.Simulate.click(ReactDOM.findDOMNode(stepperButtons[1]))
			assert(changeQuantitySpy.calledWith(2), "changeQuantity not called with correct args")
			done()
		})
	})
	describe("if the quantity provided is 100", function() {
		it("the provided value is in the input", function(done) {
			assert.equal(inputComponent.getValue(), 100)
			done()
		})
		it("clicking the '-' stepper calls changeQuantity with quantity: 99", function(done) {
			ReactTestUtils.Simulate.click(ReactDOM.findDOMNode(stepperButtons[0]))
			assert(changeQuantitySpy.calledWith(99), "changeQuantity not called with correct args")
			done()
		})
		it("clicking the '+' stepper calls changeQuantity with quantity: 101", function(done) {
			ReactTestUtils.Simulate.click(ReactDOM.findDOMNode(stepperButtons[1]))
			assert(changeQuantitySpy.calledWith(101), "changeQuantity not called with correct args")
			done()
		})

	})
	describe("changes to the input component", function() {
		it("putting in '1' results in changeQuantity getting called with '1'", function(done) {
			inputComponent.getInputDOMNode().value = 1
			ReactTestUtils.Simulate.change(inputComponent.getInputDOMNode())
			assert(changeQuantitySpy.calledWith(1), "changeQuantity not called with correct args")
			done()
		})
		it("putting in '100' results in changeQuantity getting called with '100'", function(done) {
			inputComponent.getInputDOMNode().value = 100
			ReactTestUtils.Simulate.change(inputComponent.getInputDOMNode())
			assert(changeQuantitySpy.calledWith(100), "changeQuantity not called with correct args")
			done()
		})
		it("putting in 'asdfasdfasdf100asdfasdfasdf' results in changeQuantity getting called with '100'", function(done) {
			inputComponent.getInputDOMNode().value = "asdfasdfasdf100asdfasdfasdf"
			ReactTestUtils.Simulate.change(inputComponent.getInputDOMNode())
			assert(changeQuantitySpy.calledWith(100), "changeQuantity not called with correct args")
			done()
		})
		it("putting in 'a1s0d0f' results in changeQuantity getting called with '100'", function(done) {
			inputComponent.getInputDOMNode().value = "a1s0d0f"
			ReactTestUtils.Simulate.change(inputComponent.getInputDOMNode())
			assert(changeQuantitySpy.calledWith(100), "changeQuantity not called with correct args")
			done()
		})
		it("putting in '-100' results in changeQuantity getting called with '100'", function(done) {
			inputComponent.getInputDOMNode().value = "-100"
			ReactTestUtils.Simulate.change(inputComponent.getInputDOMNode())
			assert(changeQuantitySpy.calledWith(100), "changeQuantity not called with correct args")
			done()
		})
		it("putting in '	    100	    ' results in changeQuantity getting called with '100'", function(done) {
			inputComponent.getInputDOMNode().value = "	    100	    "
			ReactTestUtils.Simulate.change(inputComponent.getInputDOMNode())
			assert(changeQuantitySpy.calledWith(100), "changeQuantity not called with correct args")
			done()
		})
		it("putting in ' 1 0 0 ' results in changeQuantity getting called with '100'", function(done) {
			inputComponent.getInputDOMNode().value = " 1 0 0 "
			ReactTestUtils.Simulate.change(inputComponent.getInputDOMNode())
			assert(changeQuantitySpy.calledWith(100), "changeQuantity not called with correct args")
			done()
		})
		it("putting in 'asdfasdfasdf' results in changeQuantity getting called with '0'", function(done) {
			inputComponent.getInputDOMNode().value = "asdfasdfasdf"
			ReactTestUtils.Simulate.change(inputComponent.getInputDOMNode())
			assert(changeQuantitySpy.calledWith(0), "changeQuantity not called with correct args")
			done()
		})
		it("putting in '' results in changeQuantity getting called with '0'", function(done) {
			inputComponent.getInputDOMNode().value = ""
			ReactTestUtils.Simulate.change(inputComponent.getInputDOMNode())
			assert(changeQuantitySpy.calledWith(0), "changeQuantity not called with correct args")
			done()
		})

	})
})
