var sinon = require('sinon');
var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');
var $ = require('jquery');
var assert = require('assert');
var Modal = require('react-bootstrap').Modal;
var Input = require('react-bootstrap').Input;

var AddRepModal = require('../js/AddRepModal.jsx');

renderAddRepModal = function() {
	renderedAddRepModal = ReactTestUtils.renderIntoDocument(< AddRepModal distributorID = {
		100
	}
	distributorName = "distributor 100" barID = {
		200
	}
	showModal = {
		true
	}
	onHide = {
		function() {}
	} />)

	inputs = ReactTestUtils.findAllInRenderedTree(renderedAddRepModal.refs.AddRepModal._modal, function(component) {

		if (ReactTestUtils.isCompositeComponentWithType(component, Input) && component.getInputDOMNode().className.includes("newRepInputs")) {
			return true
		} else {
			return false
		}
	})

	buttons = ReactTestUtils.scryRenderedDOMComponentsWithTag(renderedAddRepModal.refs.AddRepModal._modal, "button")

	newRepForm = ReactTestUtils.findAllInRenderedTree(renderedAddRepModal.refs.AddRepModal._modal, function(component) {
		if (component.id == "newRepForm") {
			return true
		} else {
			return false
		}
	})[0]

	radioButtons = ReactTestUtils.findAllInRenderedTree(renderedAddRepModal.refs.AddRepModal._modal, function(component) {
		if (ReactTestUtils.isCompositeComponentWithType(component, Input) && (component.getInputDOMNode().type == "radio")) {
			return true
		} else {
			return false
		}
	})

	submitButton = buttons[2]

	newRepNameInput = inputs[0]
	newRepPhoneInput = inputs[1]

	return renderedAddRepModal
}

describe("AddRepModal", function() {
	before(function() {
		sinon.stub(localStorage, "getItem").returns("asdfasdfasdf")
		window.API_URL = "http://localhost:1310"
	})

	beforeEach(function() {
		sinon.stub($, "ajax").yieldsTo("success", [
			{
				repID: "asdf1"
			}, {
				repID: "asdf2"
			}, {
				repID: "asdf3"
			}
		])
		renderedAddRepModal = renderAddRepModal()
	})

	afterEach(function() {
		$.ajax.restore()
	})

	it("renders a modal", function(done) {
		assert(ReactTestUtils.isCompositeComponentWithType(renderedAddRepModal.refs.AddRepModal, Modal))
		done()
	})
	it("renders radio buttons instead of select dropdown", function(done) {
		for (radioButton of radioButtons) {
			assert(radioButton.getInputDOMNode().type == "radio")
		}
		for (input of ReactTestUtils.scryRenderedComponentsWithType(renderedAddRepModal.refs.AddRepModal._modal, Input)) {
			assert(input.getInputDOMNode().type != "select")
		}
		done()

	})
	describe("initial rendering", function() {
		it("if there's no reps in the system, 'add new rep' is selected and new rep inputs are shown", function(done) {
			$.ajax.restore()
			sinon.stub($, "ajax").yieldsTo("success", [])
			renderedAddRepModal = renderAddRepModal()

			assert(radioButtons[0].getChecked())
			assert(newRepForm.className.includes("show"))
			done()
		})
		it("if there's one rep in the system, no rep is selected and new rep inputs are hidden", function(done) {
			$.ajax.restore()
			sinon.stub($, "ajax").yieldsTo("success", [
				{
					repID: "asdf1"
				}
			])
			renderedAddRepModal = renderAddRepModal()

			for (radioButton of radioButtons) {
				assert(!radioButton.getChecked())
			}
			assert(!newRepForm.className.includes("show"))
			done()
		})
		it("if there's multiple reps in the system, no rep is selected and new rep inputs are hidden", function(done) {
			$.ajax.restore()
			sinon.stub($, "ajax").yieldsTo("success", [
				{
					repID: "asdf1"
				}, {
					repID: "asdf2"
				}, {
					repID: "asdf3"
				}
			])
			renderedAddRepModal = renderAddRepModal()

			for (radioButton of radioButtons) {
				assert(!radioButton.getChecked())
			}
			assert(!newRepForm.className.includes("show"))
			done()
		})
	})
	describe("existing rep is selected", function() {
		beforeEach(function() {
			ReactTestUtils.Simulate.change(radioButtons[0].getInputDOMNode()) // first radio button is fine
		})
		it('submit button is enabled', function(done) {
			assert(!submitButton.className.includes("disabled"), "button is disabled!")
			done()
		})
		it('clicking submit button makes a POST to /accounts', function(done) {
			$.ajax.restore()
			ajaxSpy = sinon.spy($, "ajax")

			ReactTestUtils.Simulate.click(submitButton)

			assert(ajaxSpy.calledOnce, "ajax not called exactly once")
			assert(ajaxSpy.calledWithMatch({url: "http://localhost:1310/accounts"}), "ajax not called with the right url")
			assert(ajaxSpy.calledWithMatch({
				data: {
					barID: 200,
					repID: "asdf1",
					distributorID: 100
				}
			}), "ajax not called with the right data")
			done()
		})
		it("clicking the 'newRep' radio button causes the rep name and phone inputs to show", function(done) {
			for (radioButton of radioButtons) {
				if (radioButton.getValue() == "newRep") {
					ReactTestUtils.Simulate.change(radioButton.getInputDOMNode())
				}
			}
			assert(newRepForm.className.includes("show"))
			done()
		})
	})
	describe("'newRep' is selected", function() {
		beforeEach(function() {
			for (radioButton of radioButtons) {
				if (radioButton.getValue() == "newRep") {
					ReactTestUtils.Simulate.change(radioButton.getInputDOMNode())
				}
			}
		})
		it("clicking a rep radio button causes the rep name and phone inputs to hide", function(done) {
			ReactTestUtils.Simulate.change(radioButtons[0].getInputDOMNode()) // first radio button is fine
			assert(!newRepForm.className.includes("show"))
			done()
		})
		describe("rep name is empty", function() {
			beforeEach(function() {
				newRepNameInput.getInputDOMNode().value = ""
				ReactTestUtils.Simulate.change(newRepNameInput.getInputDOMNode())

				newRepPhoneInput.getInputDOMNode().value = "1234567890"
				ReactTestUtils.Simulate.change(newRepPhoneInput.getInputDOMNode())
			})
			it("submit button is disabled", function(done) {
				assert(submitButton.className.includes("disabled"))
				done()
			})
			it("nothing happens when submit button is clicked", function(done) {
				$.ajax.restore()
				ajaxSpy = sinon.spy($, "ajax")
				ReactTestUtils.Simulate.click(submitButton)
				assert.equal(ajaxSpy.callCount, 0)
				done()
			})
		})
		describe("rep name is whitespace", function() {
			beforeEach(function() {
				newRepNameInput.getInputDOMNode().value = "    	\n"
				ReactTestUtils.Simulate.change(newRepNameInput.getInputDOMNode())

				newRepPhoneInput.getInputDOMNode().value = "1234567890"
				ReactTestUtils.Simulate.change(newRepPhoneInput.getInputDOMNode())
			})
			it("submit button is disabled", function(done) {
				assert(submitButton.className.includes("disabled"))
				done()
			})
			it("nothing happens when submit button is clicked", function(done) {
				$.ajax.restore()
				ajaxSpy = sinon.spy($, "ajax")
				ReactTestUtils.Simulate.click(submitButton)
				assert.equal(ajaxSpy.callCount, 0)
				done()
			})
		})
		describe("phone number is empty", function() {
			beforeEach(function() {
				newRepNameInput.getInputDOMNode().value = "asdfasdfasdf"
				ReactTestUtils.Simulate.change(newRepNameInput.getInputDOMNode())

				newRepPhoneInput.getInputDOMNode().value = ""
				ReactTestUtils.Simulate.change(newRepPhoneInput.getInputDOMNode())
			})
			it("submit button is disabled", function(done) {
				assert(submitButton.className.includes("disabled"))
				done()
			})
			it("nothing happens when submit button is clicked", function(done) {
				$.ajax.restore()
				ajaxSpy = sinon.spy($, "ajax")
				ReactTestUtils.Simulate.click(submitButton)
				assert.equal(ajaxSpy.callCount, 0)
				done()
			})
		})
		describe("phone number is whitespace", function() {
			beforeEach(function() {
				newRepNameInput.getInputDOMNode().value = "asdfasdfasdf"
				ReactTestUtils.Simulate.change(newRepNameInput.getInputDOMNode())

				newRepPhoneInput.getInputDOMNode().value = "    	\n"
				ReactTestUtils.Simulate.change(newRepPhoneInput.getInputDOMNode())
			})
			it("submit button is disabled", function(done) {
				assert(submitButton.className.includes("disabled"))
				done()
			})
			it("nothing happens when submit button is clicked", function(done) {
				$.ajax.restore()
				ajaxSpy = sinon.spy($, "ajax")
				ReactTestUtils.Simulate.click(submitButton)
				assert.equal(ajaxSpy.callCount, 0)
				done()
			})
		})
		describe("phone number is invalid (missing a number)", function() {
			beforeEach(function() {
				newRepNameInput.getInputDOMNode().value = "asdfasdfasdf"
				ReactTestUtils.Simulate.change(newRepNameInput.getInputDOMNode())

				newRepPhoneInput.getInputDOMNode().value = "123456789"
				ReactTestUtils.Simulate.change(newRepPhoneInput.getInputDOMNode())
			})
			it("submit button is disabled", function(done) {
				assert(submitButton.className.includes("disabled"))
				done()
			})
			it("nothing happens when submit button is clicked", function(done) {
				$.ajax.restore()
				ajaxSpy = sinon.spy($, "ajax")
				ReactTestUtils.Simulate.click(submitButton)
				assert.equal(ajaxSpy.callCount, 0)
				done()
			})
		})
		describe("rep name and phone are both filled in and valid", function() {
			beforeEach(function() {
				newRepNameInput.getInputDOMNode().value = "asdfasdfasdf"
				ReactTestUtils.Simulate.change(newRepNameInput.getInputDOMNode())

				newRepPhoneInput.getInputDOMNode().value = "1234567890"
				ReactTestUtils.Simulate.change(newRepPhoneInput.getInputDOMNode())

			})
			it("submit button is enabled", function(done) {
				assert(!submitButton.className.includes("disabled"))
				done()
			})
			it('clicking submit button makes a POST to /reps, then a POST to /reps/:repID/memberships, then a POST to /accounts', function(done) {
				$.ajax.restore()
				ajaxMock = sinon.mock($)
				ajaxExpects = ajaxMock.expects("ajax").thrice()

				ajaxExpects.onFirstCall().yieldsTo("success", {user_id: "asdf1"})
				ajaxExpects.onSecondCall().yieldsTo("success")
				ajaxExpects.onThirdCall().yieldsTo("success")

				ReactTestUtils.Simulate.click(submitButton)

				assert(ajaxExpects.firstCall.calledWithMatch({url: "http://localhost:1310/reps"}), "first ajax not called with the right url")
				assert(ajaxExpects.firstCall.calledWithMatch({
					data: {
						repName: "asdfasdfasdf",
						repPhone: "1234567890"
					}
				}), "first ajax not called with the right data")
				assert(ajaxExpects.secondCall.calledWithMatch({url: "http://localhost:1310/reps/asdf1/memberships"}), "second ajax not called with the right url")
				assert(ajaxExpects.secondCall.calledWithMatch({
					data: {
						distributorID: 100
					}
				}), "second ajax not called with the right data")
				assert(ajaxExpects.thirdCall.calledWithMatch({url: "http://localhost:1310/accounts"}), "third ajax not called with the right url")
				assert(ajaxExpects.thirdCall.calledWithMatch({
					data: {
						distributorID: 100,
						barID: 200,
						repID: "asdf1"
					}
				}), "third ajax not called with the right data")
				done()
			})
			describe("rep name includes some whitespace", function() {
				it('trims whitespace, makes a POST to /reps (then some other calls we already tested)', function(done) {
					newRepNameInput.getInputDOMNode().value = "     	\nasdfasdfasdf    	\n"
					ReactTestUtils.Simulate.change(newRepNameInput.getInputDOMNode())

					$.ajax.restore()
					ajaxSpy = sinon.spy($, "ajax")

					ReactTestUtils.Simulate.click(submitButton)

					assert(ajaxSpy.calledWithMatch({
						data: {
							repName: "asdfasdfasdf",
							repPhone: "1234567890"
						}
					}))
					done()
				})
			})
		})
	})
	describe("rep phone input", function() {
		it("value is '1234567890' when '1234567890' is entered", function(done) {
			newRepPhoneInput.getInputDOMNode().value = "1234567890"
			ReactTestUtils.Simulate.change(newRepPhoneInput.getInputDOMNode())
			assert.equal(newRepPhoneInput.getValue(), "1234567890")
			done()
		})
		it("value is '0987654321' when '0987654321' is entered", function(done) {
			newRepPhoneInput.getInputDOMNode().value = "0987654321"
			ReactTestUtils.Simulate.change(newRepPhoneInput.getInputDOMNode())
			assert.equal(newRepPhoneInput.getValue(), "0987654321")
			done()
		})
		it("value is '1234567890' when 'a1s2d3f4a5s6d7f8a9s0' is entered", function(done) {
			newRepPhoneInput.getInputDOMNode().value = "a1s2d3f4a5s6d7f8a9s0"
			ReactTestUtils.Simulate.change(newRepPhoneInput.getInputDOMNode())
			assert.equal(newRepPhoneInput.getValue(), "1234567890")
			done()
		})
		it("value is '1234567890' when ' 1 2 3 4 5 6 7 8 9 0 ' is entered", function(done) {
			newRepPhoneInput.getInputDOMNode().value = " 1 2 3 4 5 6 7 8 9 0 "
			ReactTestUtils.Simulate.change(newRepPhoneInput.getInputDOMNode())
			assert.equal(newRepPhoneInput.getValue(), "1234567890")
			done()
		})
		it("value is '1234567890' when '123456789000000' is entered", function(done) {
			newRepPhoneInput.getInputDOMNode().value = "123456789000000"
			ReactTestUtils.Simulate.change(newRepPhoneInput.getInputDOMNode())
			assert.equal(newRepPhoneInput.getValue(), "1234567890")
			done()
		})
		it("value is '1234567890' when '-1234567890' is entered", function(done) {
			newRepPhoneInput.getInputDOMNode().value = "-1234567890"
			ReactTestUtils.Simulate.change(newRepPhoneInput.getInputDOMNode())
			assert.equal(newRepPhoneInput.getValue(), "1234567890")
			done()
		})
		it("value is '' when 'asdfasdfasdf' is entered", function(done) {
			newRepPhoneInput.getInputDOMNode().value = "asdfasdfasdf"
			ReactTestUtils.Simulate.change(newRepPhoneInput.getInputDOMNode())
			assert.equal(newRepPhoneInput.getValue(), "")
			done()
		})
		it("value is '1234567890' when '1234567890' with whitespace is entered", function(done) {
			newRepPhoneInput.getInputDOMNode().value = "    	\n1234567890    	\n"
			ReactTestUtils.Simulate.change(newRepPhoneInput.getInputDOMNode())
			assert.equal(newRepPhoneInput.getValue(), "1234567890")
			done()
		})
	})
})
