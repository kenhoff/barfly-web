var React = require('react');

var SizeDescription = require('./SizeDescription.jsx');
var ProductName = require("../Order/ProductName.jsx");

var ProductOrderSummaryItem = React.createClass({
	propTypes: {
		productID: React.PropTypes.number,
		productQuantity: React.PropTypes.number,
		productSizeID: React.PropTypes.number
	},
	render: function() {
		return (
			<li>{this.props.productQuantity}{" "}<ProductName productID={this.props.productID}/>{" "}
				<SizeDescription sizeID={this.props.productSizeID}/></li>
		);
	}
});

module.exports = ProductOrderSummaryItem;
