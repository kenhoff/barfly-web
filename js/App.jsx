var React = require('react');

var OrderList = require('./OrderList.jsx');

window.jQuery = window.$ = require('jquery');

var App = React.createClass({
	render: function() {
		return (
			<OrderList bar={this.props.bar}></OrderList>
		)
	}
})

module.exports = App
