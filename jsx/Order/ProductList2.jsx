var React = require('react');
var connect = require('react-redux').connect;
var bartender = require('../Bartender.jsx');
var ProductListGroup = require('./ProductListGroup.jsx');

var PresentationalProductList = React.createClass({
	render: function() {
		return (
			<div>
				<h1>asdfasdfasdf</h1>
				{this.props.products.map((productID) => {
					return (
						<ProductListGroup key={productID} productID={parseInt(productID)}></ProductListGroup>
					);
				})}
			</div>
		);
	}
});

var mapStateToProps = function(state) {
	if ("products" in state) {
		// get a list of all product IDs (keys) from state.products
		return {
			products: Object.keys(state.products)
		};
	} else {
		// if there are no keys in state.products, let bartender know
		bartender.resolve("products");
		return {products: []};
	}
};

var ContainerProductList = connect(mapStateToProps)(PresentationalProductList);

module.exports = ContainerProductList;
