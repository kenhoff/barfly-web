var React = require('react')

var Button = require('react-bootstrap').Button
var Col = require('react-bootstrap').Col
var Row = require('react-bootstrap').Row
var Grid = require('react-bootstrap').Grid

var browserHistory = require('react-router').browserHistory

var $ = require('jquery')

var OrderListItem = require('./OrderListItem.jsx')

var Orders = React.createClass({
	getInitialState: function() {
		return {orders: []}
	},
	render: function() {
		return (
			<Grid>
				<Row>
					<h1>Orders</h1>
					<Button bsStyle="primary" bsSize="large" onClick={this.newOrder}>New Order</Button>
				</Row>
				<Row>
					{this.state.orders.map(function(order) {
						return (<OrderListItem key={order.id} order={order} barID={this.props.bar}/>)
					}.bind(this))}
				</Row>
			</Grid>
		)
	},
	componentDidMount: function() {
		// make an ajax call to retrieve all orders for this.props.bar
		if (this.props.bar > 0) {
			this.loadOrdersForBar(this.props.bar)
		}
	},
	componentWillReceiveProps: function(newProps) {
		if (newProps.bar > 0) {
			this.loadOrdersForBar(newProps.bar)
		}
	},
	loadOrdersForBar: function(bar) {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/bars/" + bar + "/orders",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			success: function(orders) {
				orders.sort(function(a, b) {
					return b.id - a.id
				})
				this.setState({orders: orders})
			}.bind(this)
		})
	},
	newOrder: function() {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/bars/" + this.props.bar + "/orders",
			method: "POST",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			success: function(data) {
				browserHistory.push("/orders/" + data)
			}.bind(this)
		})
	}
})

module.exports = Orders
