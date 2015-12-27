var React = require('react');

var App = require('./App.jsx');
var Nav = require('./Nav.jsx');

var BarContext = React.createClass({
	// if we haven't loaded a bar yet, currentBar == null.
	// if there isn't a currentBar available (e.g. a user hasn't created a bar yet) then currentBar == -1.
	getInitialState: function() {
		return {currentBar: null}
	},
	render: function() {
		return (
			<div>
				<Nav currentBar={this.state.currentBar} changeBar={this.handleBarChange}/>
				<App lock={this.props.lock} idToken={this.props.idToken}/>
			</div>
		);
	},
	componentDidMount: function() {
		this.getCurrentBar();
	},
	getCurrentBar: function() {
		// just loads the first bar we get back, for now.
		$.ajax({
			url: window.API_URL + "/user/bars",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			success: function(data) {
				if (data.length != 0) {
					this.setState({currentBar: data[0]})
				} else {
					this.setState({currentBar: -1})
				}
			}.bind(this)
		})
	},
	handleBarChange: function(barID) {
		console.log("context change to", barID)
		this.setState({currentBar: barID})
	}
})
module.exports = BarContext
