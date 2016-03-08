var React = require('react')
var $ = require('jquery')

// ProductOrderSummaryItem gets a product order

// "parentOrderID": 10 ,
// "productID": 2 ,
// "productQuantity": 1 ,
// "productSizeID": 1

var ProductOrderSummaryItem = React.createClass({
	getInitialState: function() {
		return {productName: "", containerName: "", packagingName: ""}
	},
	render: function() {
		return (
			<li>{this.props.productOrder.productQuantity + " " + this.state.productName + " " + this.state.containerName + ", " + this.state.packagingName}</li>
		)
	},
	componentDidMount: function() {
		// get product name
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/products/" + this.props.productOrder.productID,
			method: "GET",
			success: function(product) {
				this.setState({productName: product.productName})
			}.bind(this)
		})

		// get product size name (container + packaging)
		this.getContainerAndPackagingID(function(err, size) {
			if ("containerID" in size) {
				this.getContainerName(size.containerID, function(err, containerName) {
					this.setState({containerName: containerName})
				}.bind(this))
			}
			if ("packagingID" in size) {
				this.getPackagingName(size.packagingID, function(err, packagingName) {
					this.setState({packagingName: packagingName})
				}.bind(this))
			}
		}.bind(this))

	},
	getContainerAndPackagingID: function(cb) {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/sizes/" + this.props.productOrder.productSizeID,
			method: "GET",
			success: function(size) {
				cb(null, size)
			}.bind(this)
		})
	},
	getContainerName: function(containerID, cb) {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/containers/" + containerID,
			method: "GET",
			success: function(container) {
				cb(null, container.containerName)
			}
		})
	},
	getPackagingName: function(packagingID, cb) {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/packaging/" + packagingID,
			method: "GET",
			success: function(packaging) {
				cb(null, packaging.packagingName)
			}
		})
	}
})

module.exports = ProductOrderSummaryItem
