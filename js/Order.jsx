var React = require('react');

var ProductCard = require('./ProductCard.jsx');
var NewProductModal = require('./NewProductModal.jsx');

var async = require('async');

var Order = React.createClass({
	// every update to the order causes the updateTimeout to fire - when updateTimeout hits 0, the order is updated
	updateTimeout: function() {
		clearTimeout(this.timeout)
		this.timeout = setTimeout(function() {
			console.log("updating order");
			this.patchOrder()
		}.bind(this), 1000)
	},
	getInitialState: function() {
		// allProducts is a list of all products that we carry, with each product having a different size.
		// orderProducts is a list of all products currently in the order (quantity > 0)
		// listProduct will be several arrays, each with a list of the products in a particular list (like starred products)
		return {allProducts: [], orderProducts: [], showNewProductModal: false}
	},
	componentWillUnmount: function() {
		clearTimeout(this.timeout)
	},
	render: function() {
		return (
			<div>
				<h1>Order #{this.props.params.orderID}</h1>
				{this.state.allProducts.map(function(product) {
					return (<ProductCard key={product.productID.toString() + product.productSizeID.toString()} productID={product.productID} productSizeID={product.productSizeID} productQuantity={this.getProductQuantity(product.productID, product.productSizeID)} changeQuantity={this.handleQuantityChange}/>)
				}.bind(this))}
				<p>Can't find what you're looking for?
					<a onClick={this.showNewProductModal}>Create a new product</a>
				</p>
				<NewProductModal showModal={this.state.showNewProductModal} onHide={this.closeNewProductModal} newProductCreated={this.getProducts}/>
			</div>
		)
	},
	showNewProductModal: function() {
		this.setState({showNewProductModal: true})
	},
	closeNewProductModal: function() {
		this.setState({showNewProductModal: false})
	},

	getProductQuantity: function(productID, productSizeID) {
		for (product of this.state.orderProducts) {
			if ((product.productID == productID) && (product.productSizeID == productSizeID)) {
				return product.productQuantity
			}
		}
		return null
	},

	// yay clusterfuck!
	handleQuantityChange: function(productID, productSizeID, productQuantity) {

		// updateTimeout handles the order patching
		this.updateTimeout()
		// change existing state to reflect new quantity change

		// if combination of productID and productSizeID exist in orderProducts,
		this.setState(function(prevState, currentProps) {
			for (var i = 0; i < prevState.orderProducts.length; i++) {
				if (((prevState.orderProducts[i].productID == productID) && (prevState.orderProducts[i].productSizeID == productSizeID))) {
					// if productQuantity == 0, then remove from orderProducts.splice(i, 1)
					if (isNaN(productQuantity) || productQuantity <= 0) {
						prevState.orderProducts.splice(i, 1)
					} else {
						// update that particular combination of productID and productSizeID with productQuantity
						prevState.orderProducts[i] = {
							productID: productID,
							productSizeID: productSizeID,
							productQuantity: productQuantity
						}
					}
					return ({orderProducts: prevState.orderProducts})
				}
			}
			// else, insert that particular combination of productID, productSizeID and productQuantity into orderProducts
			if (!isNaN(productQuantity)) {
				newOrderProducts = this.state.orderProducts
				newOrderProducts.push({productID: productID, productSizeID: productSizeID, productQuantity: productQuantity})
				// next, send a PATCH to /orders/:orderID with new order state
				// this.patchOrder(newOrderProducts)
				return ({orderProducts: newOrderProducts})
			}
		})

		// how fast can we make the round trip? do we just send it and hope state catches up, or do we ensure that the response contains exactly the right information?
		// keep in mind that we're sending entire state on change, so if anything needs to catch up it'll happen later
	},

	getOrder: function() {
		// this.props.params.orderID
		console.log("getting order for bar", this.props.bar);
		$.ajax({
			url: window.API_URL + "/bars/" + this.props.bar + "/orders/" + this.props.params.orderID,
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			method: "GET",
			success: function(data) {
				this.setState({orderProducts: data["orders"]})
				console.log("got order", data);
			}.bind(this)
		})
	},

	patchOrder: function(orderProducts) {
		data = {
			orders: this.state.orderProducts
		},
		console.log("patching order:", data);
		$.ajax({
			url: window.API_URL + "/bars/" + this.props.bar + "/orders/" + this.props.params.orderID,
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			method: "PATCH",
			data: data,
			success: function(data) {
				console.log("successfully updated order");
			}
		})
	},

	// now this function is a real clusterfuck, and desperately needs cleaning up.
	getProducts: function() {
		$.ajax({
			url: window.API_URL + "/products",
			// (no auth needed)
			method: "GET",
			success: function(productsWithSizes) {
				async.map(productsWithSizes, this.getSizesForProduct, function(err, unflattenedProducts) {
					flattenedProducts = unflattenedProducts.reduce(function(a, b) {
						return a.concat(b)
					})
					this.setState({allProducts: flattenedProducts})
				}.bind(this))
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
		console.log("updated ", this.props.bar);
		if (prevProps.bar != this.props.bar) {
			this.getOrder()
		}
	},
	getSizesForProduct: function(product, callback) {
		$.ajax({
			url: window.API_URL + "/products/" + product,
			method: "GET",
			success: function(productResult) {
				async.map(productResult["productSizes"], function(productSizeID, cb) {
					cb(null, {
						productID: product,
						productSizeID: productSizeID
					})
				}, function(err, results) {
					return callback(null, results)
				})
			}
		})
	}
})

module.exports = Order
