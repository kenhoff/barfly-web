var assert = require('assert');
var sinon = require('sinon');
var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');

var $ = require('jquery');

var RepField = require('../js/RepField.jsx');

var AddRepModal = React.createClass({
	render: function() {
		return (<div/>);
	}
});

RepField.__set__("AddRepModal", AddRepModal)

renderRepFieldComponent = function(jsx) {
	renderedRepFieldComponent = ReactTestUtils.renderIntoDocument(jsx)
	pElement = ReactTestUtils.findRenderedDOMComponentWithTag(renderedRepFieldComponent, "p")
	return renderedRepFieldComponent
}

describe("RepField", function() {
	beforeEach(function() {

		changeRepStub = sinon.stub()

		renderedRepFieldComponent = renderRepFieldComponent(<RepField distributorID={100} distributorName={"Distributor X"} changeRep={changeRepStub}/>)
	})
	afterEach(function() {})

	describe('if rep is resolving', function() {
		it('displays text "Looking up your rep at {distributorName}..."', function(done) {
			assert.equal(pElement.children[0].innerHTML, "Looking up your rep at&nbsp;")
			assert.equal(pElement.children[1].innerHTML, "Distributor X")
			assert.equal(pElement.children[2].innerHTML, "...")
			done()
		})
	})

	describe('if rep is resolved', function() {
		before(function() {
			// this all fires before the beforeEach of the parent block
			ajaxStub = sinon.stub($, "ajax")
			ajaxStub.onFirstCall().yieldsTo("success", {
				barID: 1,
				distributorID: 100,
				repID: "rep1"
			})

			ajaxStub.onSecondCall().yieldsTo("success", {name: "Rep One"})
		})
		after(function() {
			$.ajax.restore()
		})
		it('displays "Rep: {repName}"', function(done) {
			assert.equal(pElement.children[0].innerHTML, "Rep:");
			assert.equal(pElement.children[1].innerHTML, "&nbsp;");
			assert.equal(pElement.children[2].innerHTML, "Rep One");
			done()
		})
	})

	describe('if rep is not resolved', function() {
		before(function() {
			// this all fires before the beforeEach of the parent block
			ajaxStub = sinon.stub($, "ajax")
			ajaxStub.onFirstCall().yieldsTo("success", {})
		})
		after(function() {
			$.ajax.restore()
		})
		it('displays a button with text "Add my rep at {distributorName}"', function (done) {
			button = ReactTestUtils.findRenderedDOMComponentWithTag(renderedRepFieldComponent, "button")
			assert.equal(button.children[0].innerHTML, "Add my rep at&nbsp;")
			assert.equal(button.children[1].innerHTML, "Distributor X")
			done()
		})
	})
})
