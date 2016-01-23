var sinon = require('sinon');
var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');
var $ = require('jquery');
var assert = require('assert');
var Modal = require('react-bootstrap').Modal;
var Input = require('react-bootstrap').Input;

var AddRepModal = require('../js/AddRepModal.jsx');

renderAddRepModal = function() {
	return ReactTestUtils.renderIntoDocument(< AddRepModal distributorID = {
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
}

describe("AddRepModal", function() {

	before(function() {
		sinon.stub(localStorage, "getItem").returns("asdfasdfasdf")
		window.API_URL = "http://localhost:1310"
	})

	beforeEach(function() {
		sinon.stub($, "ajax").yieldsTo("success", [
			{
				repID: 1
			}, {
				repID: 2
			}, {
				repID: 3
			}
		])
		renderedAddRepModal = renderAddRepModal()

		inputs = ReactTestUtils.scryRenderedComponentsWithType(renderedAddRepModal.refs.AddRepModal._modal, Input)

		buttons = ReactTestUtils.scryRenderedDOMComponentsWithTag(renderedAddRepModal.refs.AddRepModal._modal, "button")

		newRepForm = ReactTestUtils.findAllInRenderedTree(renderedAddRepModal.refs.AddRepModal._modal, function(component) {
			if (component.id == "newRepForm") {
				return true
			} else {
				return false
			}
		})[0]

		submitButton = buttons[2]

		repSelectInput = inputs[0].getInputDOMNode()
		newRepNameInput = inputs[1].getInputDOMNode()
		newRepPhoneInput = inputs[2].getInputDOMNode()

	})

	afterEach(function() {
		$.ajax.restore()
	})

	it("renders a modal", function(done) {
		assert(ReactTestUtils.isCompositeComponentWithType(renderedAddRepModal.refs.AddRepModal, Modal))
		done()
	})
	describe("initial rendering", function() {
		it("if there's no reps in the system, 'add new rep' is selected and new rep inputs are shown", function(done) {
			$.ajax.restore()
			sinon.stub($, "ajax").yieldsTo("success", [])
			renderedAddRepModal = renderAddRepModal()

			inputs = ReactTestUtils.scryRenderedComponentsWithType(renderedAddRepModal.refs.AddRepModal._modal, Input)

			buttons = ReactTestUtils.scryRenderedDOMComponentsWithTag(renderedAddRepModal.refs.AddRepModal._modal, "button")

			newRepForm = ReactTestUtils.findAllInRenderedTree(renderedAddRepModal.refs.AddRepModal._modal, function(component) {
				if (component.id == "newRepForm") {
					return true
				} else {
					return false
				}
			})[0]

			submitButton = buttons[2]

			repSelectInput = inputs[0].getInputDOMNode()
			newRepNameInput = inputs[1].getInputDOMNode()
			newRepPhoneInput = inputs[2].getInputDOMNode()

			assert.equal(repSelectInput.value, "newRep")
			assert(newRepForm.className.includes("show"))
			done()
		})
		it("if there's one rep in the system, that rep is selected and new rep inputs are hidden", function(done) {
			$.ajax.restore()
			sinon.stub($, "ajax").yieldsTo("success", [
				{
					repID: 1
				}
			])
			renderedAddRepModal = renderAddRepModal()

			inputs = ReactTestUtils.scryRenderedComponentsWithType(renderedAddRepModal.refs.AddRepModal._modal, Input)

			buttons = ReactTestUtils.scryRenderedDOMComponentsWithTag(renderedAddRepModal.refs.AddRepModal._modal, "button")

			newRepForm = ReactTestUtils.findAllInRenderedTree(renderedAddRepModal.refs.AddRepModal._modal, function(component) {
				if (component.id == "newRepForm") {
					return true
				} else {
					return false
				}
			})[0]

			submitButton = buttons[2]

			repSelectInput = inputs[0].getInputDOMNode()
			newRepNameInput = inputs[1].getInputDOMNode()
			newRepPhoneInput = inputs[2].getInputDOMNode()
			assert.equal(repSelectInput.value, 1)
			assert(!newRepForm.className.includes("show"))
			done()
		})
		it("if there's multiple reps in the system, the first rep is selected and new rep inputs are hidden", function(done) {
			$.ajax.restore()
			sinon.stub($, "ajax").yieldsTo("success", [
				{
					repID: 1
				}, {
					repID: 2
				}, {
					repID: 3
				}
			])
			renderedAddRepModal = renderAddRepModal()

			inputs = ReactTestUtils.scryRenderedComponentsWithType(renderedAddRepModal.refs.AddRepModal._modal, Input)

			buttons = ReactTestUtils.scryRenderedDOMComponentsWithTag(renderedAddRepModal.refs.AddRepModal._modal, "button")

			newRepForm = ReactTestUtils.findAllInRenderedTree(renderedAddRepModal.refs.AddRepModal._modal, function(component) {
				if (component.id == "newRepForm") {
					return true
				} else {
					return false
				}
			})[0]

			submitButton = buttons[2]

			repSelectInput = inputs[0].getInputDOMNode()
			newRepNameInput = inputs[1].getInputDOMNode()
			newRepPhoneInput = inputs[2].getInputDOMNode()
			assert.equal(repSelectInput.value, 1)
			assert(!newRepForm.className.includes("show"))
			done()
		})
	})
	describe("existing rep is selected", function() {
		it('submit button is enabled', function(done) {
			assert(repSelectInput && (repSelectInput.value != "newRep"))
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
					repID: 1,
					distributorID: 100
				}
			}), "ajax not called with the right data")
			done()
		})
	})
	describe("'newRep' is selected", function() {
		beforeEach(function() {
			repSelectInput.value = "newRep"
			ReactTestUtils.Simulate.change(repSelectInput)
		})
		describe("rep name is empty", function() {
			beforeEach(function() {
				newRepNameInput.value = ""
				ReactTestUtils.Simulate.change(newRepNameInput)

				newRepPhoneInput.value = "1234567890"
				ReactTestUtils.Simulate.change(newRepPhoneInput)
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
				newRepNameInput.value = "    	\n"
				ReactTestUtils.Simulate.change(newRepNameInput)

				newRepPhoneInput.value = "1234567890"
				ReactTestUtils.Simulate.change(newRepPhoneInput)
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
				newRepNameInput.value = "asdfasdfasdf"
				ReactTestUtils.Simulate.change(newRepNameInput)

				newRepPhoneInput.value = ""
				ReactTestUtils.Simulate.change(newRepPhoneInput)
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
				newRepNameInput.value = "asdfasdfasdf"
				ReactTestUtils.Simulate.change(newRepNameInput)

				newRepPhoneInput.value = "    	\n"
				ReactTestUtils.Simulate.change(newRepPhoneInput)
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
				newRepNameInput.value = "asdfasdfasdf"
				ReactTestUtils.Simulate.change(newRepNameInput)

				newRepPhoneInput.value = "123456789"
				ReactTestUtils.Simulate.change(newRepPhoneInput)
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
				newRepNameInput.value = "asdfasdfasdf"
				ReactTestUtils.Simulate.change(newRepNameInput)

				newRepPhoneInput.value = "1234567890"
				ReactTestUtils.Simulate.change(newRepPhoneInput)
			})
			it("submit button is enabled", function(done) {
				assert(!submitButton.className.includes("disabled"))
				done()
			})
			it('clicking submit button makes a POST to /reps, then a POST to /reps/:repID/memberships, then a POST to /accounts', function(done) {
				$.ajax.restore()
				ajaxMock = sinon.mock($)
				ajaxExpects = ajaxMock.expects("ajax").thrice()

				ajaxExpects.onFirstCall().yieldsTo("success", {user_id: 1})
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
				assert(ajaxExpects.secondCall.calledWithMatch({url: "http://localhost:1310/reps/1/memberships"}), "second ajax not called with the right url")
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
						repID: 1
					}
				}), "third ajax not called with the right data")
				done()
			})
			describe("rep name includes some whitespace", function() {
				it('trims whitespace, makes a POST to /reps (then some other calls we already tested)', function(done) {
					newRepNameInput.value = "     	\nasdfasdfasdf    	\n"
					ReactTestUtils.Simulate.change(newRepNameInput)

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
			newRepPhoneInput.value = "1234567890"
			ReactTestUtils.Simulate.change(newRepPhoneInput)
			assert.equal(newRepPhoneInput.value, "1234567890")
			done()
		})
		it("value is '0987654321' when '0987654321' is entered", function(done) {
			newRepPhoneInput.value = "0987654321"
			ReactTestUtils.Simulate.change(newRepPhoneInput)
			assert.equal(newRepPhoneInput.value, "0987654321")
			done()
		})
		it("value is '1234567890' when 'a1s2d3f4a5s6d7f8a9s0' is entered", function(done) {
			newRepPhoneInput.value = "a1s2d3f4a5s6d7f8a9s0"
			ReactTestUtils.Simulate.change(newRepPhoneInput)
			assert.equal(newRepPhoneInput.value, "1234567890")
			done()
		})
		it("value is '1234567890' when ' 1 2 3 4 5 6 7 8 9 0 ' is entered", function(done) {
			newRepPhoneInput.value = " 1 2 3 4 5 6 7 8 9 0 "
			ReactTestUtils.Simulate.change(newRepPhoneInput)
			assert.equal(newRepPhoneInput.value, "1234567890")
			done()
		})
		it("value is '1234567890' when '123456789000000' is entered", function(done) {
			newRepPhoneInput.value = "123456789000000"
			ReactTestUtils.Simulate.change(newRepPhoneInput)
			assert.equal(newRepPhoneInput.value, "1234567890")
			done()
		})
		it("value is '1234567890' when '-1234567890' is entered", function(done) {
			newRepPhoneInput.value = "-1234567890"
			ReactTestUtils.Simulate.change(newRepPhoneInput)
			assert.equal(newRepPhoneInput.value, "1234567890")
			done()
		})
		it("value is '' when 'asdfasdfasdf' is entered", function(done) {
			newRepPhoneInput.value = "asdfasdfasdf"
			ReactTestUtils.Simulate.change(newRepPhoneInput)
			assert.equal(newRepPhoneInput.value, "")
			done()
		})
		it("value is '1234567890' when '1234567890' with whitespace is entered", function(done) {
			newRepPhoneInput.value = "    	\n1234567890    	\n"
			ReactTestUtils.Simulate.change(newRepPhoneInput)
			assert.equal(newRepPhoneInput.value, "1234567890")
			done()
		})
	})
})
