var React = require('react');
var PropTypes = React.PropTypes;

var ProductCard = require('./ProductCard.jsx');

var AllProductsList = React.createClass({

	render: function() {
		return (
			<div>
				<h2>All Products</h2>
				{this.props.allProducts.map(function(product) {
					return (<ProductCard key={product.productID} productID={product.productID} barID={this.props.barID} quantities={this.props.getQuantitiesForProduct(product.productID)} changeQuantity={this.props.handleQuantityChange} reresolveOrder={this.reresolveOrder} disabled={this.props.sent} starredSizes={this.props.starred.filter(function(starred) {
						return (starred.productID == product.productID)
					}).map(function(starred) {
						return (starred.sizeID)
					})} inStarredProductsList={false} changeStarred={this.handleStarredChange}/>)
				}.bind(this))}
			</div>
		);
	},
	handleStarredChange: function(starredChange) {
		this.props.changeStarred(starredChange)
	}
});

module.exports = AllProductsList;
