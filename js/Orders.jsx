var React = require('react');

var browserHistory = require('react-router').browserHistory;

var $ = require('jquery');

var OrderCard = require('./OrderCard.jsx');

var Orders = React.createClass({
	getInitialState: function() {
		return {orders: []}
	},
	render: function() {
		return (
			<div className="container">
				<h1>Orders</h1>
				<button onClick={this.newOrder}>New Order</button>
				{this.state.orders.map(function(order) {
					return (<OrderCard key={order.id} order={order}/>)
				})}
			</div>
		);
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
	newOrder: function(cb) {
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
});

module.exports = Orders
