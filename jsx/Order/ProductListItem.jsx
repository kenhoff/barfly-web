// the big one

var React = require('react');
var connect = require('react-redux').connect;
var bartender = require('../Bartender.jsx');

var PresentationalProductListItem = React.createClass({
	propTypes: {
		productID: React.PropTypes.number.isRequired,
		sizeID: React.PropTypes.number.isRequired,
		productName: React.PropTypes.string.isRequired,
		qty: React.PropTypes.number
	},

	render: function() {
		return (
			<div>{this.props.productName}</div>
		);
	}

});

var mapStateToProps = function(state, ownProps) {
	var props = {};
	// first, let's get productName, and make sure bartender has resolved that
	if (("products" in state) && (ownProps.productID in state.products)) {
		props.productName = state.products[ownProps.productID].productName;
	} else {
		bartender.resolve({collection: "products", id: ownProps.productID});
		props.productName = "";
	}
	if ("product_orders" in state) {
		// look up product_order by checking
		// props.qty = ...something?
	} else {
		props.qty = 0
	}
	return props;
};

var ContainerProductListItem = connect(mapStateToProps)(PresentationalProductListItem);

module.exports = ContainerProductListItem;
