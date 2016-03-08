var React = require('react')

var ProductCard = require('./ProductCard.jsx')

var ProductList = React.createClass({

	render: function() {
		return (
			<div>
				<h2>{this.props.title}</h2>
				{this.props.allProducts.map(function(product) {
					return (<ProductCard key={product.productID} productID={product.productID} barID={this.props.barID} quantities={this.getQuantitiesForProduct(product.productID)} changeQuantity={this.props.handleQuantityChange} reresolveOrder={this.props.reresolveOrder} disabled={this.props.sent} starredSizes={this.props.starred.filter(function(starred) {
						return (starred.productID == product.productID)
					}).map(function(starred) {
						return (starred.sizeID)
					})} inStarredProductsList={this.props.isStarredList} inOrderList={this.props.isOrderList} changeStarred={this.handleStarredChange} searchText={this.props.search}/>)
				}.bind(this))}
				{(this.props.isOrderList && this.props.productOrders.length == 0)
					? "You don't have any products in your order yet! Order some products below to get started."
					: null}
				{(this.props.isStarredList && this.props.starred.length == 0)
					? "You don't have any starred products yet! Hit the star next to some products below to get started."
					: null}
			</div>
		)
	},
	handleStarredChange: function(starredChange) {
		this.props.changeStarred(starredChange)
	},
	getQuantitiesForProduct: function(productID) {
		var productQuantities = []
		for (var productOrder of this.props.productOrders) {
			if (productOrder.productID == productID) {
				productQuantities.push({productQuantity: productOrder.productQuantity, productSizeID: productOrder.productSizeID})
			}
		}
		return productQuantities
	}
})

module.exports = ProductList
