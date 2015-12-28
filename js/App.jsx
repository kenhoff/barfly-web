var React = require('react');
var OrderList = require('./OrderList.jsx');

window.jQuery = window.$ = require('jquery');

var App = React.createClass({
	render: function() {
		console.log("rendering app for bar", this.props.bar);
		return (<OrderList bar={this.props.bar}/>)
	}
})

module.exports = App
