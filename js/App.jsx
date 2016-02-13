var React = require('react');

var Orders = require('./Orders.jsx');

window.jQuery = window.$ = require('jquery');

var App = React.createClass({
	render: function() {
		if (this.props.bar > 0) {
			return (
				<div className="app">
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
