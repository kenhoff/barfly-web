var React = require('react');
var BarSelector = require('./BarSelector.jsx');
var ProfileDropdown = require('./ProfileDropdown.jsx');

var History = require('react-router').History;

var Nav = React.createClass({
	mixins: [History],
	getInitialState: function() {
		return {profile: null, currentBar: null}
	},
	render: function() {
		return (
			<div>
				<nav className="navbar navbar-default navbar-fixed-top">
					<div className="container">
						<a className = "navbar-brand" href = "#" onClick = {this.goHome}>burlock</a>
						<BarSelector currentBar={this.props.currentBar} changeBar={this.props.changeBar}/>
						<ProfileDropdown signOut={this.signOut} lock={this.props.lock}/>
					</div>
				</nav>
			</div>
		);
	},

	componentDidMount: function() {
	},
	signOut: function() {
		localStorage.removeItem("access_jwt")
		localStorage.removeItem("refresh_token")
		window.location.href = "/"
	},
	goHome: function () {
		this.history.push('/')
	}
})

module.exports = Nav
