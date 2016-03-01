var React = require("react")
var PageHeader = require("react-bootstrap").PageHeader
var browserHistory = require("react-router").browserHistory
var Waypoint = require('react-waypoint')
var $ = require('jquery')

var ProductList = require('./ProductList.jsx')
var NewProductModal = require('./NewProductModal.jsx')
var OrderNavBottom = require('./OrderNavBottom.jsx')
var SearchNav = require('./SearchNav.jsx')
var SentOrderContents = require('./SentOrderContents.jsx')

var Order = React.createClass({
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
		return {
			allProducts: [],
			productOrders: [],
			starred: [],
			showNewProductModal: false,
			search: '',
			sent: true,
			searchNavFixed: false
		}
	},
	componentWillUnmount: function() {
		clearTimeout(this.timeout)
	},
	render: function() {
		if (this.state.sent) {
			return (<SentOrderContents productOrders={this.state.productOrders}/>)
		} else {
			return (
				<div>
					<Waypoint onEnter={function() {
						this.setState({searchNavFixed: false})
					}.bind(this)} onLeave={function() {
						this.setState({searchNavFixed: true})
					}.bind(this)}/>
					<div className={this.state.searchNavFixed
						? "emptyNavSpacing"
						: null}></div>
					<SearchNav fixedTop={this.state.searchNavFixed} value={this.state.search} updateSearch={function(event) {
						this.setState({search: event.target.value})
					}.bind(this)}/>
					<div className="container">
						<PageHeader>Order #{this.props.params.orderID}</PageHeader>
						<ProductList title="Your Order" allProducts={this.state.allProducts} productOrders={this.state.productOrders} sent={this.state.sent} barID={this.props.bar} handleQuantityChange={this.handleQuantityChange} starred={this.state.starred} isStarredList={false} isOrderList={true} changeStarred={this.handleStarredChange} reresolveOrder={this.reresolveOrder} search={this.state.search}/>
						<ProductList title="Starred Products" allProducts={this.state.allProducts} productOrders={this.state.productOrders} sent={this.state.sent} barID={this.props.bar} handleQuantityChange={this.handleQuantityChange} starred={this.state.starred} isStarredList={true} isOrderList={false} changeStarred={this.handleStarredChange} reresolveOrder={this.reresolveOrder} search={this.state.search}/>
						<ProductList title="All Products" allProducts={this.state.allProducts} productOrders={this.state.productOrders} sent={this.state.sent} barID={this.props.bar} handleQuantityChange={this.handleQuantityChange} starred={this.state.starred} changeStarred={this.handleStarredChange} reresolveOrder={this.reresolveOrder} isStarredList={false} isOrderList={false} search={this.state.search}/>
						<p>Can't find what you're looking for?&nbsp;
							<a onClick={this.showNewProductModal}>Create a new product</a>
						</p>
					</div>
					<NewProductModal showModal={this.state.showNewProductModal} onHide={this.closeNewProductModal} newProductCreated={this.getProducts}/>
					<OrderNavBottom disabled={this.state.sent} sendOrder={this.sendOrder} sending={this.state.sending}/>
				</div>
			)
		}
	},

	handleStarredChange: function(starredChange) {
		if (starredChange.newStarredValue == true) {
			// make API call to create new starred value
			$.ajax({
				url: process.env.BURLOCK_API_URL + "/bars/" + this.props.bar + "/starred",
				headers: {
					"Authorization": "Bearer " + localStorage.getItem("access_jwt")
				},
				method: "POST",
				data: {
					sizeID: starredChange.sizeID,
					productID: starredChange.productID
				},
				success: function() {
					var starred = this.state.starred
					starred.push({sizeID: starredChange.sizeID, productID: starredChange.productID})
					this.setState({starred: starred})
				}.bind(this)
			})
			// just push the value onto state.starred
		} else {
			// make API call to remove starred value

			$.ajax({
				url: process.env.BURLOCK_API_URL + "/bars/" + this.props.bar + "/starred",
				headers: {
					"Authorization": "Bearer " + localStorage.getItem("access_jwt")
				},
				method: "DELETE",
				data: {
					sizeID: starredChange.sizeID,
					productID: starredChange.productID
				},
				success: function() {
					// find star in state.starred with the right sizeID and productID
					var starred = this.state.starred
					for (var star of starred) {
						if ((star.sizeID == starredChange.sizeID) && (star.productID == starredChange.productID)) {
							starred.splice(starred.indexOf(star), 1)
							this.setState({starred: starred})
						}
					}
				}.bind(this)
			})

		}

		// make API call to add/remove stars
	},
	getInitialStars: function() {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/bars/" + this.props.bar + "/starred",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			method: "GET",
			success: function(stars) {
				this.setState({starred: stars})
			}.bind(this)
		})
	},
	sendOrder: function() {
		this.setState({sending: true})
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/bars/" + this.props.bar + "/orders/" + this.props.params.orderID,
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			method: "POST",
			success: function() {
				this.setState({sending: false})
				browserHistory.push("/orders")
			}.bind(this),
			error: function() {
				this.setState({sending: false})
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

		// updateTimeout handles the order patching
		this.updateTimeout()
		// change existing state to reflect new quantity change

		// if combination of productID and productSizeID exist in productOrders,
		this.setState(function(prevState) {
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
				var newOrderProducts = this.state.productOrders
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
			url: process.env.BURLOCK_API_URL + "/bars/" + this.props.bar + "/orders/" + this.props.params.orderID,
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			method: "GET",
			success: function(data) {
				// handle if sent isn't actually in the order yet
				this.setState({
					productOrders: data.productOrders,
					sent: (data.sent || false)
				})
			}.bind(this)
		})
	},

	patchOrder: function() {
		var data = {
			orders: this.state.productOrders
		}
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/bars/" + this.props.bar + "/orders/" + this.props.params.orderID,
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			method: "PATCH",
			data: data,
			success: function() {}
		})
	},

	// now this function is a real clusterfuck, and desperately needs cleaning up.
	getProducts: function() {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/products",
			// (no auth needed)
			method: "GET",
			success: function(products) {
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
		this.getInitialStars()
		if (this.props.bar) {
			this.getOrder()
		}
	},
	componentDidUpdate: function(prevProps) {
		if (prevProps.bar != this.props.bar) {
			this.getOrder()
		}
	}
})

module.exports = Order
