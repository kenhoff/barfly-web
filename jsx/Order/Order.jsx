var React = require("react");
var PageHeader = require("react-bootstrap").PageHeader;
var browserHistory = require("react-router").browserHistory;
var Waypoint = require('react-waypoint');
var $ = require('jquery');
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Grid = require('react-bootstrap').Grid;
var Nav = require('react-bootstrap').Nav;
var moment = require('moment-timezone');
var jstz = require('jstimezonedetect');
var async = require('async');

var ProductList = require('./ProductList.jsx');
var NewProductModal = require('./NewProductModal.jsx');
var OrderNav = require('./OrderNav.jsx');
var OrderNavBottom = require('./OrderNavBottom.jsx');
var SentOrderContents = require('./SentOrderContents.jsx');
var SentOrderMessages = require('./SentOrderMessages.jsx');
var ShoppingCart = require('./ShoppingCart.jsx');

var bartender = require('../Bartender.jsx');

var Order = React.createClass({
	propTypes: {},
	// every update to the order causes the updateTimeout to fire - when updateTimeout hits 0, the order is updated
	updateTimeout: function() {
		clearTimeout(this.timeout);
		this.timeout = setTimeout(function() {
			this.patchOrder();
		}.bind(this), 1000);
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
			sent: false,
			OrderNavFixed: false,
			resolving: true,
			sentAt: null
		};
	},
	componentWillUnmount: function() {
		clearTimeout(this.timeout);
	},
	render: function() {
		if (this.state.resolving) {
			return (
				<div></div>
			);
		} else if (this.state.sent) {
			var timezone = jstz.determine().name();
			return (
				<Grid>
					<Row>
						<PageHeader>{"Order #" + this.props.params.orderID + " "}
							<small>{(this.state.sentAt
									? moment(this.state.sentAt).tz(timezone).format('llll')
									: "Sent")}</small>
						</PageHeader>
					</Row>
					<Row>
						<Col xs={12} sm={6}>
							<SentOrderContents productOrders={this.state.productOrders}/>
						</Col>
						<Col xs={12} sm={6}>
							<SentOrderMessages productOrders={this.state.productOrders} barID={this.props.bar} zipCode={this.props.zipcode}/>
						</Col>
					</Row>
				</Grid>
			);
		} else {
			return (
				<div>
					<Waypoint onEnter={function() {
						this.setState({OrderNavFixed: false});
					}.bind(this)} onLeave={function() {
						this.setState({OrderNavFixed: true});
					}.bind(this)}/>
					<div className={this.state.OrderNavFixed
						? "emptyNavSpacing"
						: null}></div>
					<OrderNav fixedTop={this.state.OrderNavFixed} value={this.state.search} updateSearch={function(event) {
						this.setState({search: event.target.value});
					}.bind(this)}>
						<Nav pullRight>
							<ShoppingCart disabled={this.state.productOrders.length == 0} sendOrder={this.sendOrder} sending={this.state.sending} productOrders={this.state.productOrders}/>
						</Nav>
					</OrderNav>
					<div className="container">
						<PageHeader>{"Order #" + this.props.params.orderID + " "}
							<small>Unsent</small>
						</PageHeader>
						<ProductList title="Starred Products" allProducts={this.state.allProducts} productOrders={this.state.productOrders} sent={this.state.sent} barID={this.props.bar} handleQuantityChange={this.handleQuantityChange} starred={this.state.starred} isStarredList={true} isOrderList={false} changeStarred={this.handleStarredChange} reresolveOrder={this.reresolveOrder} search={this.state.search}/>
						<ProductList title="All Products" allProducts={this.state.allProducts} productOrders={this.state.productOrders} sent={this.state.sent} barID={this.props.bar} handleQuantityChange={this.handleQuantityChange} starred={this.state.starred} changeStarred={this.handleStarredChange} reresolveOrder={this.reresolveOrder} isStarredList={false} isOrderList={false} search={this.state.search}/>
						<p>Can't find what you're looking for?&nbsp;
							<a onClick={this.showNewProductModal}>Create a new product</a>
						</p>
					</div>
					<OrderNavBottom showNewProductModal={this.showNewProductModal}/>
					<NewProductModal showModal={this.state.showNewProductModal} onHide={this.closeNewProductModal} newProductCreated={this.getProducts}/>
				</div>
			);
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
					var starred = this.state.starred;
					starred.push({sizeID: starredChange.sizeID, productID: starredChange.productID});
					this.setState({starred: starred});
				}.bind(this)
			});
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
					var starred = this.state.starred;
					for (var star of starred) {
						if ((star.sizeID == starredChange.sizeID) && (star.productID == starredChange.productID)) {
							starred.splice(starred.indexOf(star), 1);
							this.setState({starred: starred});
						}
					}
				}.bind(this)
			});
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
				this.setState({starred: stars});
			}.bind(this)
		});
	},
	sendOrder: function() {
		this.setState({sending: true});
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/bars/" + this.props.bar + "/orders/" + this.props.params.orderID,
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			method: "POST",
			success: function() {
				this.setState({sending: false});
				// send intercom thing
				var metadata = {
					product_orders: this.state.productOrders.length,
					sent_date: Math.floor((new Date()).getTime() / 1000)
				};
				window.Intercom('trackEvent', "sent_order", metadata);
				browserHistory.push("/orders");
				bartender.sendOrder(this.props.params.orderID);
			}.bind(this),
			error: function() {
				this.setState({sending: false});
			}.bind(this)
		});
	},
	showNewProductModal: function() {
		this.setState({showNewProductModal: true});
	},
	closeNewProductModal: function() {
		this.setState({showNewProductModal: false});
	},
	// yay clusterfuck!
	handleQuantityChange: function(productID, productSizeID, productQuantity) {
		bartender.updateOrder({orderID: parseInt(this.props.params.orderID), productID, productSizeID, productQuantity});
		// updateTimeout handles the order patching
		this.updateTimeout();
		// change existing state to reflect new quantity change
		// if combination of productID and productSizeID exist in productOrders,
		var newProductOrders = Object.assign([], this.state.productOrders);
		for (var i = 0; i < newProductOrders.length; i++) {
			if (((newProductOrders[i].productID == productID) && (newProductOrders[i].productSizeID == productSizeID))) {
				// if productQuantity == 0, then remove from productOrders.splice(i, 1)
				if (isNaN(productQuantity) || productQuantity <= 0) {
					newProductOrders.splice(i, 1);
				} else {
					// update that particular combination of productID and productSizeID with productQuantity
					newProductOrders[i].productQuantity = productQuantity;
				}
				return this.setState({productOrders: newProductOrders});
			}
		}
		// else, insert that particular combination of productID, productSizeID and productQuantity into productOrders
		if (!isNaN(productQuantity)) {
			// first, push the new quantity, with the product ID, size ID, and quantity onto state
			// then, shoot off the requests to get the name, container name, and packaging name
			var newProductOrder = {
				productID: productID,
				productSizeID: productSizeID,
				productQuantity: productQuantity
			};
			newProductOrders.push(newProductOrder);
			this.setState({
				productOrders: newProductOrders
			}, function() {
				async.parallel([
					function(cb2) {
						$.ajax({
							url: process.env.BURLOCK_API_URL + "/products/" + productID,
							method: "GET",
							success: function(product) {
								newProductOrder.productName = product.productName;
								cb2(null);
							}
						});
					},
					function(cb2) {
						$.ajax({
							url: process.env.BURLOCK_API_URL + "/sizes/" + productSizeID,
							method: "GET",
							success: function(size) {
								$.ajax({
									url: process.env.BURLOCK_API_URL + "/containers/" + size.containerID,
									method: "GET",
									success: function(container) {
										newProductOrder.containerName = container.containerName;
										$.ajax({
											url: process.env.BURLOCK_API_URL + "/packaging/" + size.packagingID,
											method: "GET",
											success: function(packaging) {
												newProductOrder.packagingName = packaging.packagingName;
												cb2(null);
											}
										});
									}
								});
							}
						});
					}
				], function() {
					// once the requests come back, find those productOrders and update their name, container name, and packaging name
					var currentProductOrders = Object.assign([], this.state.productOrders);
					for (var currentProductOrder of currentProductOrders) {
						if (((currentProductOrder.productID == productID) && (currentProductOrder.productSizeID == productSizeID))) {
							currentProductOrder = Object.assign({}, currentProductOrder, {
								productName: newProductOrder.productName,
								containerName: newProductOrder.containerName,
								packagingName: newProductOrder.packagingName
							});
						}
					}
					this.setState({productOrders: currentProductOrders});
				}.bind(this));
			});

		}
	},
	reresolveOrder: function() {
		this.setState({allProducts: [], productOrders: []});
		this.getProducts();
		this.getOrder();
	},
	getOrder: function() {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/bars/" + this.props.bar + "/orders/" + this.props.params.orderID,
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			method: "GET",
			success: function(data) {
				// here, go through every productOrder, get the name for that product, and attach it to the productOrder
				async.map(data.productOrders, function(productOrder, cb1) {
					var newProductOrder = {};
					async.parallel([
						function(cb2) {
							// get product name
							$.ajax({
								url: process.env.BURLOCK_API_URL + "/products/" + productOrder.productID,
								method: "GET",
								success: function(product) {
									newProductOrder.productName = product.productName;
									cb2(null);
								}
							});
						},
						function(cb2) {
							$.ajax({
								url: process.env.BURLOCK_API_URL + "/sizes/" + productOrder.productSizeID,
								method: "GET",
								success: function(size) {
									$.ajax({
										url: process.env.BURLOCK_API_URL + "/containers/" + size.containerID,
										method: "GET",
										success: function(container) {
											newProductOrder.containerName = container.containerName;
											$.ajax({
												url: process.env.BURLOCK_API_URL + "/packaging/" + size.packagingID,
												method: "GET",
												success: function(packaging) {
													newProductOrder.packagingName = packaging.packagingName;
													cb2(null);
												}
											});
										}
									});
								}
							});
						}
					], function(err) {
						cb1(err, Object.assign({}, productOrder, newProductOrder));
					});
				}, function(err, results) {
					this.setState({
						productOrders: results,
						sent: (data.sent || false),
						resolving: false,
						sentAt: (data.sentAt || null)
					});
				}.bind(this));

			}.bind(this)
		});
	},
	patchOrder: function() {
		var data = {
			orders: this.state.productOrders
		};
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/bars/" + this.props.bar + "/orders/" + this.props.params.orderID,
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			method: "PATCH",
			data: data,
			success: function() {}
		});
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
						return 1;
					} else if (a.productName.toLowerCase() < b.productName.toLowerCase()) {
						return -1;
					} else {
						return 0;
					}
				});
				this.setState({allProducts: products});
			}.bind(this)
		});
	},
	componentDidMount: function() {
		this.getProducts();
		this.getInitialStars();
		if (this.props.bar) {
			this.getOrder();
		}
	},
	componentDidUpdate: function(prevProps) {
		if (prevProps.bar != this.props.bar) {
			this.getOrder();
		}
	}
});
module.exports = Order;
