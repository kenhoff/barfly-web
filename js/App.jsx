var React = require('react');

var Orders = require('./Orders.jsx');

window.jQuery = window.$ = require('jquery');

var App = React.createClass({
	render: function() {
		return (
			<div>
				{React.cloneElement(this.props.children, {bar: this.props.bar})}
			</div>
		)
	}
})

module.exports = App
