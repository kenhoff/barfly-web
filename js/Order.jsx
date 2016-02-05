var React = require('react');

var ProductCard = require('./ProductCard.jsx');
var NewProductModal = require('./NewProductModal.jsx');
var OrderNavBottom = require('./OrderNavBottom.jsx');
var History = require('react-router').History;
var $ = require('jquery');

var async = require('async');

var Order = React.createClass({
	mixins: [History],
	// every update to the order causes the updateTimeout to fire - when updateTimeout hits 0, the order is updated
	updateTimeout: function() {
		clearTimeout(this.timeout)
		this.timeout = setTimeout(function() {
			this.patchOrder()
		}.bind(this), 1000)
	},
	getInitialState: function() {
		// allProducts is a list of all products that we carry, with each product having a different size.
		// productOrders is a list of all products currently in the order (quantity > 0)
		return {allProducts: [], productOrders: [], showNewProductModal: false, sent: true}
	},
	componentWillUnmount: function() {
		clearTimeout(this.timeout)
	},
	render: function() {
		return (
			<div>
				<h1>Order #{this.props.params.orderID}</h1>
				{this.state.allProducts.map(function(productID) {
					return (<ProductCard key={productID} productID={productID} barID={this.props.bar} quantities={this.getQuantitiesForProduct(productID)} changeQuantity={this.handleQuantityChange} reresolveOrder={this.reresolveOrder} disabled={this.state.sent}/>)
				}.bind(this))}
				<p>Can't find what you're looking for?&nbsp;
					<a onClick={this.showNewProductModal}>Create a new product</a>
				</p>
				<NewProductModal showModal={this.state.showNewProductModal} onHide={this.closeNewProductModal} newProductCreated={this.getProducts}/>
				<OrderNavBottom disabled={this.state.sent} sendOrder={this.sendOrder}/>
			</div>
		)
	},

	// i think these might be the same function

	getQuantitiesForProduct: function(productID) {
		productQuantities = []
		for (productOrder of this.state.productOrders) {
			if (productOrder.productID == productID) {
				productQuantities.push({productQuantity: productOrder.productQuantity, productSizeID: productOrder.productSizeID})
			}
		}
		return productQuantities
	},

	sendOrder: function() {
		$.ajax({
			url: window.API_URL + "/bars/" + this.props.bar + "/orders/" + this.props.params.orderID,
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			method: "POST",
			success: function() {
				this.history.push("/orders")
			}.bind(this)
		})
	},

	showNewProductModal: function() {
		this.setState({showNewProductModal: true})
	},
	closeNewProductModal: function() {
		this.setState({showNewProductModal: false})
	},

	// yay clusterfuck!
	handleQuantityChange: function(productID, productSizeID, productQuantity) {

		console.log("productID", productID);
		console.log("productSizeID", productSizeID);
		console.log("productQuantity", productQuantity);

		// updateTimeout handles the order patching
		this.updateTimeout()
		// change existing state to reflect new quantity change

		// if combination of productID and productSizeID exist in productOrders,
		this.setState(function(prevState, currentProps) {
			for (var i = 0; i < prevState.productOrders.length; i++) {
				if (((prevState.productOrders[i].productID == productID) && (prevState.productOrders[i].productSizeID == productSizeID))) {
					// if productQuantity == 0, then remove from productOrders.splice(i, 1)
					if (isNaN(productQuantity) || productQuantity <= 0) {
						prevState.productOrders.splice(i, 1)
					} else {
						// update that particular combination of productID and productSizeID with productQuantity
						prevState.productOrders[i] = {
							productID: productID,
							productSizeID: productSizeID,
							productQuantity: productQuantity
						}
					}
					return ({productOrders: prevState.productOrders})
				}
			}
			// else, insert that particular combination of productID, productSizeID and productQuantity into productOrders
			if (!isNaN(productQuantity)) {
				newOrderProducts = this.state.productOrders
				newOrderProducts.push({productID: productID, productSizeID: productSizeID, productQuantity: productQuantity})
				// next, send a PATCH to /orders/:orderID with new order state
				// this.patchOrder(newOrderProducts)
				return ({productOrders: newOrderProducts})
			}
		})

		// how fast can we make the round trip? do we just send it and hope state catches up, or do we ensure that the response contains exactly the right information?
		// keep in mind that we're sending entire state on change, so if anything needs to catch up it'll happen later
	},
	reresolveOrder: function() {
		this.setState({allProducts: [], productOrders: []})
		this.getProducts()
		this.getOrder()
	},

	getOrder: function() {
		$.ajax({
			url: window.API_URL + "/bars/" + this.props.bar + "/orders/" + this.props.params.orderID,
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			method: "GET",
			success: function(data) {
				console.log(data.productOrders);
				// handle if sent isn't actually in the order yet
				this.setState({
					productOrders: data.productOrders,
					sent: (data.sent || false)
				})
			}.bind(this)
		})
	},

	patchOrder: function(productOrders) {
		data = {
			orders: this.state.productOrders
		},
		$.ajax({
			url: window.API_URL + "/bars/" + this.props.bar + "/orders/" + this.props.params.orderID,
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			method: "PATCH",
			data: data,
			success: function(data) {}
		})
	},

	// now this function is a real clusterfuck, and desperately needs cleaning up.
	getProducts: function() {
		$.ajax({
			url: window.API_URL + "/products",
			// (no auth needed)
			method: "GET",
			success: function(products) {
				console.log(products);
				products.sort(function(a, b) {
					if (a.productName.toLowerCase() > b.productName.toLowerCase()) {
						return 1
					} else if (a.productName.toLowerCase() < b.productName.toLowerCase()) {
						return -1
					} else {
						return 0
					}
				})
				this.setState({allProducts: products})
			}.bind(this)
		})
	},
	componentDidMount: function() {
		this.getProducts()
		if (this.props.bar) {
			this.getOrder()
		}
	},
	componentDidUpdate: function(prevProps) {
		if (prevProps.bar != this.props.bar) {
			this.getOrder()
		}
	},
	getSizesForProduct: function(product, callback) {
		$.ajax({
			url: window.API_URL + "/products/" + product.productID,
			method: "GET",
			success: function(productResult) {
				async.map(productResult["productSizes"], function(productSizeID, cb) {
					cb(null, {
						productID: product.productID,
						productSizeID: productSizeID,
						productName: product.productName
					})
				}, function(err, results) {
					return callback(null, results)
				})
			}
		})
	}
})

module.exports = Order
