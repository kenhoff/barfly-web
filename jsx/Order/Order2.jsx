var React = require('react');
var ProductList = require('./ProductList2.jsx');
var bartender = require('../Bartender.jsx');

var Order2 = React.createClass({
	propTypes: {
		params: React.PropTypes.objectOf(React.PropTypes.string)
	},
	render: function() {
		console.log(this.props.params.orderID);
		return (
			<ProductList></ProductList>
		);
	}
});

module.exports = Order2;
