var React = require('react');

var Modal = require('react-bootstrap').Modal;
var Input = require('react-bootstrap').Input;

var ProductCard = require('./ProductCard.jsx');

var async = require('async');

var Order = React.createClass({
	getInitialState: function() {
		// allProducts is a list of all products that we carry, with each product having a different size.
		// orderProducts is a list of all products currently in the order (quantity > 0)
		// listProduct will be several arrays, each with a list of the products in a particular list (like starred products)
		return {allProducts: [], orderProducts: [], showNewProductModal: false}
	},
	render: function() {
		return (
			<div>
				<h1>Order #{this.props.params.orderID}</h1>
				{this.state.allProducts.map(function(product) {
					return (<ProductCard key={product.productID.toString() + product.productSize.toString()} productID={product.productID} productSizeID={product.productSize} productQuantity={this.getProductQuantity(product.productID, product.productSize)} changeQuantity={this.handleQuantityChange}/>)
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

	getProductQuantity: function(productID, productSize) {
		for (product of this.state.orderProducts) {
			if ((product.productID == productID) && (product.productSize == productSize)) {
				return product.productQuantity
			}
		}
		return null
	},

	handleQuantityChange: function(productID, productSize, productQuantity) {
		// change existing state to reflect new quantity change

		// if combination of productID and productSize exist in orderProducts,
		this.setState(function(prevState, currentProps) {
			for (var i = 0; i < prevState.orderProducts.length; i++) {
				if (((prevState.orderProducts[i].productID == productID) && (prevState.orderProducts[i].productSize == productSize))) {

					// if productQuantity == 0, then remove from orderProducts.splice(i, 1)
					if (productQuantity == 0) {
						prevState.orderProducts.splice(i, 1)
					} else {
						// update that particular combination of productID and productSize with productQuantity
						prevState.orderProducts[i] = {
							productID: productID,
							productSize: productSize,
							productQuantity: productQuantity
						}
					}

					// next, send a PATCH to /orders/:orderID with new order state
					this.patchOrder(prevState.orderProducts)
					return ({orderProducts: prevState.orderProducts})
				}
			}
			// else, insert that particular combination of productID, productSize and productQuantity into orderProducts
			newOrderProducts = this.state.orderProducts
			newOrderProducts.push({productID: productID, productSize: productSize, productQuantity: productQuantity})
			// next, send a PATCH to /orders/:orderID with new order state
			this.patchOrder(newOrderProducts)
			return ({orderProducts: newOrderProducts})
		})

		// how fast can we make the round trip? do we just send it and hope state catches up, or do we ensure that the response contains exactly the right information?
		// keep in mind that we're sending entire state on change, so if anything needs to catch up it'll happen later
	},

	patchOrder: function(orderProducts) {
		$.ajax({
			url: window.API_URL + "/bars/" + this.props.bar + "/orders/" + this.props.params.orderID,
			method: "PATCH",
			data: {
				orders: orderProducts
			},
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
	},
	getSizesForProduct: function(product, callback) {
		$.ajax({
			url: window.API_URL + "/products/" + product,
			method: "GET",
			success: function(productResult) {
				async.map(productResult["productSizes"], function(productSize, cb) {
					cb(null, {
						productID: product,
						productSize: productSize
					})
				}, function(err, results) {
					return callback(null, results)
				})
			}
		})
	}
})

var NewProductModal = React.createClass({
	getInitialState: function() {
		return ({showNewSizeInput: false, sizes: []})
	},
	componentDidMount: function() {
		// bullshit that we can't initialize the ref to productSizeInput here, but whatever. We can work around it somehow
		this.updateSizes()
	},
	updateSizes: function() {
		$.ajax({
			url: window.API_URL + "/sizes",
			method: "GET",
			success: function(sizes) {
				this.setState({sizes: sizes})
			}.bind(this)
		})
	},
	render: function() {
		return (
			<Modal show={this.props.showModal} onHide={this.props.onHide}>
				<Modal.Header closeButton>
					<Modal.Title>Let's add a new product to Barfly.</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Input type="text" label="What's the name of your product?" placeholder="Bob's Genuine Beer" ref="productNameInput"/>
					<Input type="select" label="What size does your product come in?" ref="productSizeInput" onChange={this.selectSize}>
						{this.state.sizes.map(function(size) {
							return (<SizeOption key={size} sizeID={size}/>)
						})}
						<option value="newSize">Add new size</option>
					</Input>
					<Input className={this.state.showNewSizeInput
						? "show"
						: "hidden"} type="text" placeholder="750ml (Case of 6)" ref="productNewSizeInput"/>
				</Modal.Body>
				<Modal.Footer>
					<button className="btn btn-default" onClick={this.props.onHide}>Cancel</button>
					<button className="btn btn-primary" onClick={this.submitProduct}>Create</button>
				</Modal.Footer>
			</Modal>
		);
	},
	submitProduct: function() {
		// if the user has specified a new size, POST /sizes first, then POST /products with the new ID.
		// if the user didn't specify a new size, then just POST /products with the given ID.

		if (this.refs.productSizeInput.getValue() == "newSize") {
			this.sendNewSize(this.refs.productNewSizeInput.getValue(), function(newSizeID) {
				this.sendNewProduct(this.refs.productNameInput.getValue(), newSizeID, function() {
					this.updateSizes()
					this.props.newProductCreated()
					this.props.onHide()
					this.setState({showNewSizeInput: false})
				}.bind(this))
			}.bind(this))
		} else {
			this.sendNewProduct(this.refs.productNameInput.getValue(), this.refs.productSizeInput.getValue(), function() {
				this.updateSizes()
				this.props.newProductCreated()
				this.props.onHide()
				this.setState({showNewSizeInput: false})
			}.bind(this))
		}

	},
	selectSize: function() {
		if (this.refs.productSizeInput.getValue() == "newSize") {
			this.setState({showNewSizeInput: true})
		} else {
			this.setState({showNewSizeInput: false})
		}
	},
	sendNewSize: function(sizeName, cb) {
		$.ajax({
			url: window.API_URL + "/sizes",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			method: "POST",
			data: {
				sizeName: sizeName
			},
			success: function(sizeID) {
				if (cb) {
					cb(sizeID)
				}
			}.bind(this)
		})
	},
	sendNewProduct: function(name, sizeID, cb) {
		$.ajax({
			url: window.API_URL + "/products",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			method: "POST",
			data: {
				productName: name,
				productSize: sizeID
			},
			success: function(data) {
				if (cb) {
					cb()
				}
			}.bind(this)
		})
	}
	// don't forget to get product sizes, populate modal
})

var SizeOption = React.createClass({
	getInitialState: function() {
		return ({sizeName: ""})
	},
	render: function() {
		return (
			<option value={this.props.sizeID}>{this.state.sizeName}</option>
		)
	},
	componentDidMount: function() {
		$.ajax({
			url: window.API_URL + "/sizes/" + this.props.sizeID,
			method: "GET",
			success: function(size) {
				this.setState({sizeName: size.sizeName})
			}.bind(this)
		})
	}
})

module.exports = Order
