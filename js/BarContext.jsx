var React = require('react');

var App = require('./App.jsx');

var BarContext = React.createClass({
	render: function() {
		return (<App lock={this.props.lock} idToken={this.props.idToken}/>);
	}
})
module.exports = BarContext
