var React = require('react');

var Orders = require('./Orders.jsx');

window.jQuery = window.$ = require('jquery');

var App = React.createClass({
	render: function() {
		console.log(this.props.bar);
		if (this.props.bar > 0) {
			return (
				<div>
					{React.cloneElement(this.props.children, {bar: this.props.bar})}
				</div>
			)
		} else {
			return (
				<div></div>
			)
		}
	}
})

module.exports = App
