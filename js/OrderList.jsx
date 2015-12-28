var React = require('react');

var OrderList = React.createClass({
	getInitialState: function() {
		return {orders: []}
	},
	render: function() {
		console.log("rendering orderlist for bar", this.props.bar);
		return (
			<div>
				<h1>Orders</h1>
				{this.state.orders.map(function(order) {
					return (
						<h3>order!</h3>
					)
				})}
			</div>
		);
	},
	componentDidMount: function() {
		// make an ajax call to retrieve all orders for this.props.bar
		if (this.props.bar) {
			console.log("making a call to get all orders for", this.props.bar);
			this.loadOrdersForBar(this.props.bar, function(orders) {
				console.log(orders);
			})
		}
	},
	componentWillReceiveProps: function(newProps) {
		if (newProps.bar) {
			console.log("making a call to get all orders for", newProps.bar);
			this.loadOrdersForBar(newProps.bar, function(orders) {
				console.log(orders);
			})
		}
	},
	loadOrdersForBar: function(bar, cb) {
		$.ajax({
			url: window.API_URL + "/bars/" + bar + "/orders",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			success: function(data) {
				if (data.length != 0) {
					cb(data)
				}
			}
		})
	}
});

module.exports = OrderList
