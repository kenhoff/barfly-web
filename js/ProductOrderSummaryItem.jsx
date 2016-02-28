var React = require('react')
var $ = require('jquery')

// ProductOrderSummaryItem gets a product order

// "parentOrderID": 10 ,
// "productID": 2 ,
// "productQuantity": 1 ,
// "productSizeID": 1

var ProductOrderSummaryItem = React.createClass({
	getInitialState: function() {
		return {productName: "", sizeName: ""}
	},
	render: function() {
		return (
			<li>{this.props.productOrder.productQuantity + " " + this.state.productName + " " + this.state.sizeName}</li>
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
	}
})

module.exports = ProductOrderSummaryItem
