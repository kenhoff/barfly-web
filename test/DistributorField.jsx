var sinon = require('sinon');
var assert = require('assert');

var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');

var DistributorField = require('../js/DistributorField.jsx');

var $ = require('jquery');

var AddDistributorModal = React.createClass({
	render: function() {
		return (<div/>)
	}
})

DistributorField.__set__("AddDistributorModal", AddDistributorModal)

renderDistributorField = function(jsx) {
	renderedDistributorField = ReactTestUtils.renderIntoDocument(jsx)
	pElement = ReactTestUtils.findRenderedDOMComponentWithTag(renderedDistributorField, "p")
	return renderedDistributorField
}

describe("DistributorField", function() {
	beforeEach(function() {
		renderedDistributorField = renderDistributorField(<DistributorField productName={"Product X"}/>)
	})
	it.skip("requires a productID and a barID")
	describe("if a distributor is resolving", function() {
		it('renders "Looking up the distributor for {productName}...', function(done) {
			assert.equal(pElement.children[0].innerHTML, "Looking up the distributor for&nbsp;");
			assert.equal(pElement.children[1].innerHTML, "Product X");
			assert.equal(pElement.children[2].innerHTML, "...");
			done()
		})
	})
	describe("if a distributor is resolved", function() {
		beforeEach(function() {
			ajaxStub = sinon.stub($, "ajax")
			ajaxStub.onFirstCall().yieldsTo("success", {zipCode: 12345})
			ajaxStub.onSecondCall().yieldsTo("success", {distributorID: 100})
			ajaxStub.onThirdCall().yieldsTo("success", {distributorName: "Distributor Y"})

			changeDistributorSpy = sinon.spy()

			renderedDistributorField = renderDistributorField(<DistributorField productName={"Product X"} changeDistributor={changeDistributorSpy}/>)
		})
		afterEach(function() {
			$.ajax.restore()
		})
		it('renders "Distributor: {distributorName}', function(done) {
			assert.equal(pElement.children[0].innerHTML, "Distributor:");
			assert.equal(pElement.children[1].innerHTML, "&nbsp;")
			assert.equal(pElement.children[2].innerHTML, "Distributor Y")
			done()
		})
		it('calls this.props.changeDistributor with the distributorID and distributorName', function(done) {
			assert.equal(changeDistributorSpy.callCount, 1)
			assert(changeDistributorSpy.calledWith(100, "Distributor Y"))
			done()
		})
	})
	describe("if a distributor is not found", function() {
		beforeEach(function() {
			ajaxStub = sinon.stub($, "ajax")
			ajaxStub.onFirstCall().yieldsTo("success", {zipCode: 12345})
			ajaxStub.onSecondCall().yieldsTo("success", {})

			changeDistributorSpy = sinon.spy()

			renderedDistributorField = renderDistributorField(<DistributorField productName={"Product X"} changeDistributor={changeDistributorSpy}/>)
		})
		afterEach(function() {
			$.ajax.restore()
		})
		it('renders a button with text "Add a Distributor for {productName}"', function(done) {
			button = ReactTestUtils.findRenderedDOMComponentWithTag(renderedDistributorField, "button")
			assert.equal(button.innerHTML, "Add a Distributor for Product X")
			done()
		})
		it.skip('when button is clicked, "AddDistributorModal" is opened', function(done) {
			openModalSpy = sinon.spy(renderedDistributorField, "openModal")
			button = ReactTestUtils.findRenderedDOMComponentWithTag(renderedDistributorField, "button")
			ReactTestUtils.Simulate.click(button)
		})
		it('calls this.props.changeDistributor with a null distributorID and distributorName', function(done) {
			assert.equal(changeDistributorSpy.callCount, 1)
			assert(changeDistributorSpy.calledWith(null, null))
			done()
		})
	})
})
