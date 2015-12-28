var React = require('react');

var OrderList = React.createClass({
	getInitialState: function() {
		return {orders: []}
	},
	render: function() {
		return (
			<div>
				<h1>Orders</h1>
				<button onClick={this.newOrder}>New Order</button>
				{this.state.orders.map(function(order) {
					return (
						<h3 key={order}>Order #{order}</h3>
					)
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
			url: window.API_URL + "/bars/" + bar + "/orders",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			success: function(data) {
				data.reverse()
				this.setState({orders: data})
			}.bind(this)
		})
	},
	newOrder: function(cb) {
		$.ajax({
			url: window.API_URL + "/bars/" + this.props.bar + "/orders",
			method: "POST",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			success: function(data) {
				this.loadOrdersForBar(this.props.bar)
			}.bind(this)
		})
	}
});

module.exports = OrderList
