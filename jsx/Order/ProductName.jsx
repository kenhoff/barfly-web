var React = require('react');
var connect = require('react-redux').connect;

var bartender = require('../Bartender.jsx');

var PresentationalProductName = React.createClass({
	propTypes: {
		productID: React.PropTypes.number.isRequired,
		productName: React.PropTypes.string
	},
	render: function() {
		return (
			<span>{this.props.productName}</span>
		);
	}
});

var mapStateToProps = function(state, ownProps) {
	if (("products" in state) && (ownProps.productID in state.products)) {
		return {
			productName: state.products[ownProps.productID].productName
		};
	} else {
		bartender.resolve({collection: "products", id: ownProps.productID});
		return {productName: ""};
	}
};

var ContainerProductName = connect(mapStateToProps)(PresentationalProductName);

module.exports = ContainerProductName;
