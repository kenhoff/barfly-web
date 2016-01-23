var sinon = require('sinon');
var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');
var $ = require('jquery');
var assert = require('assert');
var Modal = require('react-bootstrap').Modal;
var Input = require('react-bootstrap').Input;

var AddDistributorModal = require('../js/AddDistributorModal.jsx');

renderAddDistributorModal = function() {
	return ReactTestUtils.renderIntoDocument(< AddDistributorModal productName = "asdfasdfasdf" zipCode = "12345" productID = {
		100
	}
	showModal = {
		true
	} />)
}

describe("AddDistributorModal", function() {

	before(function() {
		sinon.stub(localStorage, "getItem").returns("asdfasdfasdf")
		window.API_URL = "http://localhost:1310"
	})

	after(function () {
		localStorage.getItem.restore()
	})

	beforeEach(function() {
		sinon.stub($, "ajax").yieldsTo("success", [
			{
				id: 1,
				distributorName: "distributor 1"
			}, {
				id: 2,
				distributorName: "distributor 2"
			}, {
				id: 3,
				distributorName: "distributor 3"
			}
		])
		renderedAddDistributorModal = renderAddDistributorModal()

		inputs = ReactTestUtils.scryRenderedComponentsWithType(renderedAddDistributorModal.refs.AddDistributorModal._modal, Input)

		buttons = ReactTestUtils.scryRenderedDOMComponentsWithTag(renderedAddDistributorModal.refs.AddDistributorModal._modal, "button")

		submitButton = buttons[2]

		distributorSelectInput = inputs[0].getInputDOMNode()
		newDistributorNameInput = inputs[1].getInputDOMNode()
	})

	afterEach(function() {
		$.ajax.restore()
	})

	it("renders a modal", function(done) {
		assert(ReactTestUtils.isCompositeComponentWithType(renderedAddDistributorModal.refs.AddDistributorModal, Modal))
		done()
	})
	it("passing in props for produceName and zipCode results in the Modal.Header rendering correctly", function(done) {
		title = ReactTestUtils.findRenderedComponentWithType(renderedAddDistributorModal.refs.AddDistributorModal._modal, Modal.Title)
		// console.log(title.props.children);
		assert.equal(title.props.children[1], "asdfasdfasdf")
		assert.equal(title.props.children[3], "12345")
		done()
	})

	describe("initial visibility of inputs", function() {
		describe("if there's no distributors in the system", function() {
			beforeEach(function() {
				$.ajax.restore()
				sinon.stub($, "ajax").yieldsTo("success", [])
				// render with new stub
				renderedAddDistributorModal = renderAddDistributorModal()

				inputs = ReactTestUtils.scryRenderedComponentsWithType(renderedAddDistributorModal.refs.AddDistributorModal._modal, Input)

				distributorSelectInput = inputs[0].getInputDOMNode()
				newDistributorNameInput = inputs[1].getInputDOMNode()
			})

			it("the distributor select input is set to 'newDistributor', and the 'newDistributorName' input is visible", function(done) {
				assert.equal(distributorSelectInput.value, "newDistributor")
				assert(newDistributorNameInput.className.includes("show"))
				done()
			})
		})

		describe("if there's one distributor in the system", function() {
			beforeEach(function() {
				$.ajax.restore()
				sinon.stub($, "ajax").yieldsTo("success", [
					{
						id: 1,
						distributorName: "distributor 1"
					}
				])
				// render with new stub
				renderedAddDistributorModal = renderAddDistributorModal()

				inputs = ReactTestUtils.scryRenderedComponentsWithType(renderedAddDistributorModal.refs.AddDistributorModal._modal, Input)

				distributorSelectInput = inputs[0].getInputDOMNode()
				newDistributorNameInput = inputs[1].getInputDOMNode()
			})

			it("the distributor select input is set to that distributor, and the 'newDistributorName' input is hidden", function(done) {
				assert.equal(distributorSelectInput.value, 1)
				assert(newDistributorNameInput.className.includes("hidden"))
				done()
			})

			it("changing the distributor select input to 'newDistributor' causes the 'newDistributorName' input to become visible", function(done) {
				distributorSelectInput.value = "newDistributor"
				ReactTestUtils.Simulate.change(distributorSelectInput)
				assert(newDistributorNameInput.className.includes("show"))
				done()
			})
		})

		describe("if there's more than one distributor in the system", function() {
			it("the distributor select input is set to the first distributor, and the 'newDistributorName' input is hidden", function(done) {
				assert.equal(distributorSelectInput.value, 1)
				assert(newDistributorNameInput.className.includes("hidden"))
				done()
			})
		})
	})

	describe("if the distributor input is set to a distributor", function() {
		it("changing the distributor select input to 'newDistributor' causes the 'newDistributorName' input to become visible", function(done) {
			distributorSelectInput.value = "newDistributor"
			ReactTestUtils.Simulate.change(distributorSelectInput)
			assert(newDistributorNameInput.className.includes("show"))
			done()
		})

		it("the 'submit' button is enabled", function(done) {
			assert(!submitButton.className.includes("disabled"))
			done()
		})

		it("clicking the 'submit' button causes a single POST to /products/:productID/zipcodes/:zipcode/distributor", function(done) {
			$.ajax.restore()

			ajaxSpy = sinon.spy($, "ajax")

			ReactTestUtils.Simulate.click(submitButton)

			assert(ajaxSpy.calledOnce, "ajax not called only once")
			assert(ajaxSpy.calledWithMatch({url: "http://localhost:1310/products/100/zipcodes/12345/distributor"}), "not called with the right URL")
			assert(ajaxSpy.calledWithMatch({
				data: {
					distributorID: 1
				}
			}), "not called with the right data")
			done()
		})
	})

	describe("if the distributor input is set to 'newDistributor'", function() {

		beforeEach(function() {
			distributorSelectInput.value = "newDistributor"
			ReactTestUtils.Simulate.change(distributorSelectInput)
		})

		it("changing the distributor select input to a distributor causes the 'newDistributorName' input to become hidden", function(done) {
			distributorSelectInput.value = 1
			ReactTestUtils.Simulate.change(distributorSelectInput)
			assert(newDistributorNameInput.className.includes("hidden"))
			done()
		})

		describe("the 'newDistributorName' is empty", function() {
			before(function() {
				newDistributorNameInput.value = ""
				ReactTestUtils.Simulate.change(newDistributorNameInput)
			})
			it("the 'submit' button is disabled", function(done) {
				assert(submitButton.className.includes("disabled"), "button is not disabled")
				done()
			})

			it("clicking on the 'submit' button does nothing", function(done) {
				$.ajax.restore()
				ajaxSpy = sinon.spy($, "ajax")

				ReactTestUtils.Simulate.click(submitButton)
				assert.equal(ajaxSpy.callCount, 0)
				done()
				ajaxSpy.restore()
				sinon.stub($, "ajax")
			})
		})

		describe("the 'newDistributorName' is only whitespace", function() {
			before(function() {
				newDistributorNameInput.value = "     	\n"
				ReactTestUtils.Simulate.change(newDistributorNameInput)
			})
			it("the 'submit' button is disabled", function(done) {
				assert(submitButton.className.includes("disabled"), "button is not disabled")
				done()
			})
			it("clicking on the 'submit' button does nothing", function(done) {
				$.ajax.restore()
				ajaxSpy = sinon.spy($, "ajax")

				ReactTestUtils.Simulate.click(submitButton)
				assert.equal(ajaxSpy.callCount, 0)
				done()
				ajaxSpy.restore()
				sinon.stub($, "ajax")
			})
		})
		describe("the 'newDistributorName' is filled", function() {
			beforeEach(function() {
				newDistributorNameInput.value = "asdfasdfasdf"
				ReactTestUtils.Simulate.change(newDistributorNameInput)
			})

			it("the 'submit' button is enabled", function(done) {
				assert(!submitButton.className.includes("disabled"), "button is not enabled")
				done()
			})

			it("then clicking the 'submit' button causes a POST to /distributors, then a POST to /products/:productID/zipcodes/:zipcode/distributor", function(done) {
				$.ajax.restore()
				ajaxMock = sinon.mock($)
				ajaxExpects = ajaxMock.expects("ajax").twice()

				ajaxExpects.onCall(0).yieldsTo("success", {
					distributorID: 100,
					distributorName: "distributor 100"
				})
				ReactTestUtils.Simulate.click(submitButton)

				assert(ajaxExpects.firstCall.calledWithMatch({url: "http://localhost:1310/distributors"}), "incorrect URL on the first call")

				assert(ajaxExpects.firstCall.calledWithMatch({
					data: {
						distributorName: "asdfasdfasdf"
					}
				}), "first call not called with the right data")

				assert(ajaxExpects.secondCall.calledWithMatch({url: "http://localhost:1310/products/100/zipcodes/12345/distributor"}), "incorrect URL on the second call")

				assert(ajaxExpects.secondCall.calledWithMatch({
					data: {
						distributorID: 100
					}
				}), "second call not called with the right data")
				done()
			})
		})
	})

})
