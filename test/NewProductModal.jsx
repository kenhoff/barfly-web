var assert = require('assert');
var sinon = require('sinon');
var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');
var Modal = require('react-bootstrap').Modal;
var Input = require('react-bootstrap').Input;

var NewProductModal = require('../js/NewProductModal.jsx');

// notes: for a bunch of these, we actually need to check to see if the disabled button is clicked, and handle accordingly

describe("NewProductModal", function() {

	before(function() {
		sinon.stub(localStorage, "getItem").returns("asdfasdfasdf")
		window.API_URL = "http://localhost:1310"
	})
	after(function () {
		localStorage.getItem.restore()
	})

	beforeEach(function() {
		sinon.stub($, "ajax").yieldsTo("success", [1, 2, 3])
		renderedComponent = ReactTestUtils.renderIntoDocument(< NewProductModal showModal = {
			true
		} />)
	})

	afterEach(function() {
		$.ajax.restore()
	})

	it("renders a modal", function(done) {
		assert(ReactTestUtils.isCompositeComponentWithType(renderedComponent.refs.NewProductModal, Modal))
		done()
	})
	describe("validate name input", function() {
		it("trims whitespace on either side of the name when submitted", function(done) {
			$.ajax.restore()

			ajaxMock = sinon.mock($)
			ajaxExpects = ajaxMock.expects("ajax")

			productNameInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewProductModal._modal, Input)[0].getInputDOMNode()
			productNameInputNode.value = "	   \nasdfasdfasdf\n	   "
			ReactTestUtils.Simulate.change(productNameInputNode)
			sizeInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewProductModal._modal, Input)[1].getInputDOMNode()
			sizeInputNode.value = 1
			ReactTestUtils.Simulate.change(sizeInputNode)

			submitButton = ReactTestUtils.scryRenderedDOMComponentsWithTag(renderedComponent.refs.NewProductModal._modal, "button")[2]
			ReactTestUtils.Simulate.click(submitButton)

			assert(ajaxExpects.calledOnce, "ajax wasn't called once")
			assert(ajaxExpects.calledWithMatch({url: "http://localhost:1310/products"}), "didn't have right URL")
			assert(ajaxExpects.calledWithMatch({
				data: {
					productName: "asdfasdfasdf"
				}
			}), "didn't have right data")
			ajaxMock.restore()
			sinon.stub($, "ajax")
			done()
		})
	})
	describe("'new size' text input", function() {
		it("is displayed if there are no sizes", function(done) {
			$.ajax.restore()
			sinon.stub($, "ajax").yieldsTo("success", [])

			renderedComponent = ReactTestUtils.renderIntoDocument(< NewProductModal showModal = {
				true
			} />)

			newSizeInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewProductModal._modal, Input)[2].getInputDOMNode()
			assert(newSizeInputNode.className.includes("show"), "new size input isn't shown")
			done()
		})
		it("is not displayed if there is one existing size", function(done) {
			$.ajax.restore()
			sinon.stub($, "ajax").yieldsTo("success", [1])

			renderedComponent = ReactTestUtils.renderIntoDocument(< NewProductModal showModal = {
				true
			} />)

			newSizeInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewProductModal._modal, Input)[2].getInputDOMNode()
			assert(newSizeInputNode.className.includes("hidden"), "new size input is shown")
			done()
		})
		it("is not displayed if there are some existing sizes", function(done) {
			$.ajax.restore()
			sinon.stub($, "ajax").yieldsTo("success", [1, 2, 3])

			renderedComponent = ReactTestUtils.renderIntoDocument(< NewProductModal showModal = {
				true
			} />)

			newSizeInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewProductModal._modal, Input)[2].getInputDOMNode()
			assert(newSizeInputNode.className.includes("hidden"), "new size input is shown")
			done()
		})
	})
	describe("button enabled/disabled", function() {
		it("is disabled if 'name' input is empty", function(done) {
			$.ajax.restore()

			ajaxSpy = sinon.spy($, "ajax")
			submitProductSpy = sinon.spy(renderedComponent, "submitProduct")

			productNameInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewProductModal._modal, Input)[0].getInputDOMNode()
			productNameInputNode.value = ""
			ReactTestUtils.Simulate.change(productNameInputNode)

			sizeInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewProductModal._modal, Input)[1].getInputDOMNode()
			sizeInputNode.value = 1
			ReactTestUtils.Simulate.change(sizeInputNode)

			submitButton = ReactTestUtils.scryRenderedDOMComponentsWithTag(renderedComponent.refs.NewProductModal._modal, "button")[2]
			ReactTestUtils.Simulate.click(submitButton)

			// button is (cosmetically) disabled
			assert(submitButton.className.includes("disabled"), "button isn't disabled!")
			// submitProduct is called
			assert(submitProductSpy.calledOnce)
			// ajax isn't called
			assert(ajaxSpy.callCount == 0, "ajax called")

			$.ajax.restore()
			sinon.stub($, "ajax")
			done()
		})

		it("is disabled if 'name' input is just white space", function(done) {
			$.ajax.restore()

			ajaxSpy = sinon.spy($, "ajax")
			submitProductSpy = sinon.spy(renderedComponent, "submitProduct")

			productNameInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewProductModal._modal, Input)[0].getInputDOMNode()
			productNameInputNode.value = "     	\n\n"
			ReactTestUtils.Simulate.change(productNameInputNode)
			sizeInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewProductModal._modal, Input)[1].getInputDOMNode()
			sizeInputNode.value = 1
			ReactTestUtils.Simulate.change(sizeInputNode)

			submitButton = ReactTestUtils.scryRenderedDOMComponentsWithTag(renderedComponent.refs.NewProductModal._modal, "button")[2]
			ReactTestUtils.Simulate.click(submitButton)

			// button is (cosmetically) disabled
			assert(submitButton.className.includes("disabled"), "button isn't disabled!")
			// submitProduct is called
			assert(submitProductSpy.calledOnce)
			// ajax isn't called
			assert(ajaxSpy.callCount == 0, "ajax called")

			$.ajax.restore()
			sinon.stub($, "ajax")
			done()
		})
		it("is disabled if 'add new size' option is selected AND 'new size text' input is empty", function(done) {
			$.ajax.restore()

			ajaxSpy = sinon.spy($, "ajax")
			submitProductSpy = sinon.spy(renderedComponent, "submitProduct")

			productNameInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewProductModal._modal, Input)[0].getInputDOMNode()
			productNameInputNode.value = "asdfasdfasdf"
			ReactTestUtils.Simulate.change(productNameInputNode)

			sizeInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewProductModal._modal, Input)[1].getInputDOMNode()
			sizeInputNode.value = "newSize"
			ReactTestUtils.Simulate.change(sizeInputNode)

			newSizeTextInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewProductModal._modal, Input)[2].getInputDOMNode()
			newSizeTextInputNode.value = ""
			ReactTestUtils.Simulate.change(newSizeTextInputNode)

			submitButton = ReactTestUtils.scryRenderedDOMComponentsWithTag(renderedComponent.refs.NewProductModal._modal, "button")[2]
			ReactTestUtils.Simulate.click(submitButton)

			// button is (cosmetically) disabled
			assert(submitButton.className.includes("disabled"), "button isn't disabled!")
			// submitProduct is called
			assert(submitProductSpy.calledOnce, "submit product not called")
			// ajax isn't called
			assert(ajaxSpy.callCount == 0, "ajax called")

			$.ajax.restore()
			sinon.stub($, "ajax")
			done()
		})
		it("is disabled if 'add new size' option is selected AND 'new size text' input is whitespace", function(done) {
			$.ajax.restore()

			ajaxSpy = sinon.spy($, "ajax")
			submitProductSpy = sinon.spy(renderedComponent, "submitProduct")

			productNameInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewProductModal._modal, Input)[0].getInputDOMNode()
			productNameInputNode.value = "asdfasdfasdf"
			ReactTestUtils.Simulate.change(productNameInputNode)

			sizeInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewProductModal._modal, Input)[1].getInputDOMNode()
			sizeInputNode.value = "newSize"
			ReactTestUtils.Simulate.change(sizeInputNode)

			newSizeTextInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewProductModal._modal, Input)[2].getInputDOMNode()
			newSizeTextInputNode.value = "          \n	"
			ReactTestUtils.Simulate.change(newSizeTextInputNode)

			submitButton = ReactTestUtils.scryRenderedDOMComponentsWithTag(renderedComponent.refs.NewProductModal._modal, "button")[2]
			ReactTestUtils.Simulate.click(submitButton)

			// button is (cosmetically) disabled
			assert(submitButton.className.includes("disabled"), "button isn't disabled!")
			// submitProduct is called
			assert(submitProductSpy.calledOnce, "submit product not called")
			// ajax isn't called
			assert(ajaxSpy.callCount == 0, "ajax called")

			$.ajax.restore()
			sinon.stub($, "ajax")
			done()
		})
		it("is enabled if 'name' is filled and some other size is selected", function(done) {

			productNameInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewProductModal._modal, Input)[0].getInputDOMNode()
			productNameInputNode.value = "asdfasdfasdf"
			ReactTestUtils.Simulate.change(productNameInputNode)

			sizeInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewProductModal._modal, Input)[1].getInputDOMNode()
			sizeInputNode.value = 1
			ReactTestUtils.Simulate.change(sizeInputNode)

			submitButton = ReactTestUtils.scryRenderedDOMComponentsWithTag(renderedComponent.refs.NewProductModal._modal, "button")[2]

			// button is (cosmetically) enabled
			assert(!submitButton.className.includes("disabled"), "button isn't enabled!")

			done()
		})
		it("is enabled if 'name' is filled, 'add new size' option is selected, and 'new size text' input is filled", function(done) {
			productNameInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewProductModal._modal, Input)[0].getInputDOMNode()
			productNameInputNode.value = "asdfasdfasdf"
			ReactTestUtils.Simulate.change(productNameInputNode)

			sizeInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewProductModal._modal, Input)[1].getInputDOMNode()
			sizeInputNode.value = "newSize"
			ReactTestUtils.Simulate.change(sizeInputNode)

			newSizeTextInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewProductModal._modal, Input)[2].getInputDOMNode()
			newSizeTextInputNode.value = "new size 1"
			ReactTestUtils.Simulate.change(newSizeTextInputNode)

			submitButton = ReactTestUtils.scryRenderedDOMComponentsWithTag(renderedComponent.refs.NewProductModal._modal, "button")[2]

			assert(!submitButton.className.includes("disabled"), "button isn't enabled!")

			done()
		})
		it("clicking on enabled button with some other size selected makes a call to /products", function(done) {

			$.ajax.restore()

			ajaxSpy = sinon.spy($, "ajax")

			productNameInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewProductModal._modal, Input)[0].getInputDOMNode()
			productNameInputNode.value = "asdfasdfasdf"
			ReactTestUtils.Simulate.change(productNameInputNode)

			sizeInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewProductModal._modal, Input)[1].getInputDOMNode()
			sizeInputNode.value = 1
			ReactTestUtils.Simulate.change(sizeInputNode)

			submitButton = ReactTestUtils.scryRenderedDOMComponentsWithTag(renderedComponent.refs.NewProductModal._modal, "button")[2]
			ReactTestUtils.Simulate.click(submitButton)

			assert(ajaxSpy.calledOnce)
			assert(ajaxSpy.calledWithMatch({url: "http://localhost:1310/products"}), "incorrect URL")
			assert(ajaxSpy.calledWithMatch({
				data: {
					productName: "asdfasdfasdf",
					productSize: 1
				}
			}), "incorrect data")
			done()
		})
		it("clicking on enabled button with 'add new size' selected makes a call to /sizes, then to  /products", function(done) {
			$.ajax.restore()
			ajaxMock = sinon.mock($)
			ajaxExpects = ajaxMock.expects("ajax").twice()

			// okay, the first ajax call is going to be a POST to /sizes, and returns a size ID
			ajaxExpects.onCall(0).yieldsTo("success", 10)
			// the second ajax call is going to be a POST to /products, with the productName and product size ID

			productNameInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewProductModal._modal, Input)[0].getInputDOMNode()
			productNameInputNode.value = "asdfasdfasdf"
			ReactTestUtils.Simulate.change(productNameInputNode)

			sizeInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewProductModal._modal, Input)[1].getInputDOMNode()
			sizeInputNode.value = "newSize"
			ReactTestUtils.Simulate.change(sizeInputNode)

			newSizeTextInputNode = ReactTestUtils.scryRenderedComponentsWithType(renderedComponent.refs.NewProductModal._modal, Input)[2].getInputDOMNode()
			newSizeTextInputNode.value = "new size 1"
			ReactTestUtils.Simulate.change(newSizeTextInputNode)

			submitButton = ReactTestUtils.scryRenderedDOMComponentsWithTag(renderedComponent.refs.NewProductModal._modal, "button")[2]
			ReactTestUtils.Simulate.click(submitButton)

			// assert(ajaxExpects.called)
			assert(ajaxExpects.firstCall.calledWithMatch({url: "http://localhost:1310/sizes"}), "incorrect URL")
			assert(ajaxExpects.firstCall.calledWithMatch({
				data: {
					sizeName: "new size 1"
				}
			}), "incorrect data on the first call")
			assert(ajaxExpects.secondCall.calledWithMatch({url: "http://localhost:1310/products"}), "incorrect URL")
			assert(ajaxExpects.secondCall.calledWithMatch({
				data: {
					productName: "asdfasdfasdf",
					productSize: 10
				}
			}), "incorrect data on the second call")
			done()
			ajaxMock.restore()
			sinon.stub($, "ajax")
		})
	})
})
