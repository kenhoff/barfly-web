// the big one

var React = require('react');
var connect = require('react-redux').connect;
var bartender = require('../Bartender.jsx');

var PresentationalProductListItem = React.createClass({
	propTypes: {
		productID: React.PropTypes.number.isRequired,
		sizeID: React.PropTypes.number.isRequired,
		productName: React.PropTypes.string
	},

	render: function() {
		return (
			<div>{this.props.productName}</div>
		);
	}

});

var mapStateToProps = function(state, ownProps) {
	// first, let's get productName, and make sure bartender has resolved that
	if (("products" in state) && (ownProps.productID in state.products)) {
		return {
			productName: state.products[ownProps.productID].productName
		};
	} else {
		bartender.resolve({collection: "products", id: ownProps.productID});
		return {productName: ""};
	}
};

var ContainerProductListItem = connect(mapStateToProps)(PresentationalProductListItem);

module.exports = ContainerProductListItem;
