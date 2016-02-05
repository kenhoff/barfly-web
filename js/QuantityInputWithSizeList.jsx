var React = require('react');

var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;

var QuantityInputWithSize = require('./QuantityInputWithSize.jsx');

// passed in a list of sizes, and quantities

var QuantityInputWithSizeList = React.createClass({
	render: function() {
		if (this.props.productSizes && (this.props.productSizes.length != 0)) {
			return (
				<div>
					{this.props.productSizes.map(function(sizeID) {
						return (<QuantityInputWithSize key={sizeID} sizeID={sizeID} quantity={this.getQuantityForSizeID(sizeID)} changeQuantity={this.props.changeQuantity.bind(this, sizeID)} disabled={this.props.disabled}/>)
					}.bind(this))}
				</div>
			)
		} else {
			return (
				<div>no product sizes found, add a new product size</div>
			)
		}
	},
	getQuantityForSizeID: function(sizeID) {
		for (quantity of this.props.quantities) {
			if (quantity.productSizeID == sizeID) {
				return quantity.productQuantity
			}
		}
	}
});

module.exports = QuantityInputWithSizeList;
