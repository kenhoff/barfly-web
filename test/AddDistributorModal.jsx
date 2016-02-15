var sinon = require('sinon');
var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');
var $ = require('jquery');
var assert = require('assert');
var Modal = require('react-bootstrap').Modal;
var Input = require('react-bootstrap').Input;

var AddDistributorModal = require('../js/AddDistributorModal.jsx');

renderAddDistributorModal = function() {
	renderedAddDistributorModal = ReactTestUtils.renderIntoDocument(< AddDistributorModal productName = "asdfasdfasdf" zipCode = "12345" productID = {
		100
	}
	showModal = {
		true
	} />)
	buttons = ReactTestUtils.scryRenderedDOMComponentsWithTag(renderedAddDistributorModal.refs.AddDistributorModal._modal, "button")

	// inputs = ReactTestUtils.scryRenderedComponentsWithType(renderedAddDistributorModal.refs.AddDistributorModal._modal, Input)

	newDistributorNameInput = ReactTestUtils.findAllInRenderedTree(renderedAddDistributorModal.refs.AddDistributorModal._modal, function(component) {
		return (ReactTestUtils.isCompositeComponentWithType(component, Input) && component.getInputDOMNode().type == "text")
	})[0].getInputDOMNode()

	// newDistributorNameInput = ReactTestUtils.findRenderedComponentWithType(renderedAddDistributorModal.refs.AddDistributorModal._modal, Input).getInputDOMNode()

	submitButton = buttons[2]

	radioButtons = ReactTestUtils.findAllInRenderedTree(renderedAddDistributorModal.refs.AddDistributorModal._modal, function(component) {
		return (ReactTestUtils.isCompositeComponentWithType(component, Input) && component.getInputDOMNode().type == "radio")
	})

	return renderedAddDistributorModal
}

describe("AddDistributorModal", function() {

	before(function() {
		sinon.stub(localStorage, "getItem").returns("asdfasdfasdf")
	})

	after(function() {
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
	it("the distributor select input is a radio button selector, not a dropdown", function(done) {
		for (radioButton of radioButtons) {
			assert.equal(radioButton.getInputDOMNode().type, "radio")
		}
		done()
	})

	describe("initial visibility of inputs", function() {
		describe("if there's no distributors in the system", function() {
			beforeEach(function() {
				$.ajax.restore()
				sinon.stub($, "ajax").yieldsTo("success", [])
				// render with new stub
				renderedAddDistributorModal = renderAddDistributorModal()
			})

			it("the distributor select input only has the 'newDistributor' option", function(done) {
				assert.equal(radioButtons.length, 1)
				assert.equal(radioButtons[0].getValue(), "newDistributor")
				done()
			})

			it("the distributor select input is set to 'newDistributor'", function(done) {
				assert(radioButtons[0].getChecked())
				done()
			})

			it("the 'newDistributorName' input is visible", function(done) {
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
				renderedAddDistributorModal = renderAddDistributorModal()
			})

			it("the distributor select input is blank", function(done) {
				for (radioButton of radioButtons) {
					assert(!radioButton.getChecked())
				}
				done()
			})

			it("the 'newDistributorName' input is hidden", function(done) {
				assert(newDistributorNameInput.className.includes("hidden"))
				done()
			})

			it("changing the distributor select input to 'newDistributor' causes the 'newDistributorName' input to become visible", function(done) {
				// find the radio button with the right value
				for (radioButton of radioButtons) {
					if (radioButton.getValue() == "newDistributor") {
						ReactTestUtils.Simulate.change(radioButton.getInputDOMNode())
					}
				}
				assert(newDistributorNameInput.className.includes("show"))
				done()
			})

			it("the distributor select input has the first distributor option, and the 'newDistributor' option", function(done) {
				assert.equal(radioButtons[0].getValue(), 1)
				assert.equal(radioButtons[1].getValue(), "newDistributor")
				done()
			})

		})

		describe("if there's more than one distributor in the system", function() {
			it("the distributor select input is blank", function(done) {
				for (radioButton of radioButtons) {
					assert(!radioButton.getChecked())
				}
				done()
			})
			it("the 'newDistributorName' input is hidden", function(done) {
				assert(newDistributorNameInput.className.includes("hidden"))
				done()
			})
			it("the distributor select input has all the distributor options, and the 'newDistributor' option", function(done) {
				assert.equal(radioButtons[0].getValue(), 1)
				assert.equal(radioButtons[1].getValue(), 2)
				assert.equal(radioButtons[2].getValue(), 3)
				assert.equal(radioButtons[3].getValue(), "newDistributor")
				done()
			})
		})
	})

	describe("if the distributor input is set to a distributor", function() {
		beforeEach(function() {
			ReactTestUtils.Simulate.change(radioButtons[0].getInputDOMNode())
		})

		it("changing the distributor select input to 'newDistributor' causes the 'newDistributorName' input to become visible", function(done) {
			for (radioButton of radioButtons) {
				if (radioButton.getValue() == "newDistributor") {
					ReactTestUtils.Simulate.change(radioButton.getInputDOMNode())
				}
			}
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
			assert(ajaxSpy.calledWithMatch({
				url: process.env.BURLOCK_API_URL + "/products/100/zipcodes/12345/distributor"
			}), "not called with the right URL")
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
			for (radioButton of radioButtons) {
				if (radioButton.getValue() == "newDistributor") {
					ReactTestUtils.Simulate.change(radioButton.getInputDOMNode())
				}
			}
		})

		it("changing the distributor select input to a distributor causes the 'newDistributorName' input to become hidden", function(done) {
			ReactTestUtils.Simulate.change(radioButtons[0].getInputDOMNode())
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

				assert(ajaxExpects.firstCall.calledWithMatch({
					url: process.env.BURLOCK_API_URL + "/distributors"
				}), "incorrect URL on the first call")

				assert(ajaxExpects.firstCall.calledWithMatch({
					data: {
						distributorName: "asdfasdfasdf"
					}
				}), "first call not called with the right data")

				assert(ajaxExpects.secondCall.calledWithMatch({
					url: process.env.BURLOCK_API_URL + "/products/100/zipcodes/12345/distributor"
				}), "incorrect URL on the second call")

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
