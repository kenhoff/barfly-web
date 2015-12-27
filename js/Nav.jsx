var React = require('react');
var BarSelector = require('./BarSelector.jsx');

var Nav = React.createClass({
	getInitialState: function() {
		return {profile: null, currentBar: null}
	},
	render: function() {
		return (
			<div>
				<nav className="navbar navbar-default navbar-fixed-top">
					<div className="container">
						<BarSelector currentBar={this.props.currentBar} changeBar={this.props.changeBar}/>
						<ul className="nav navbar-nav navbar-right">
							<li className="navbar-text">Hi there!</li>
							<li className="navbar-text" onClick={this.signOut}>Sign out</li>
						</ul>
					</div>
				</nav>
			</div>
		);
	},

	// code to re-insert once we have profile stuff working
	// <li className="navbar-text">Hi there
	// 	{this.state.profile.given_name}!</li>

	componentDidMount: function() {
		// this.props.lock.getProfile(localStorage.getItem("access_jwt"), function(err, profile) {
		// 	if (err) {
		// 		this.refreshToken(function() {
		// 			this.componentDidMount()
		// 		}.bind(this))
		// 		return
		// 	} else {
		// 		this.setState({profile: profile})
		// 	}
		// }.bind(this))
	},
	signOut: function() {
		localStorage.removeItem("access_jwt")
		localStorage.removeItem("refresh_token")
		window.location.href = "/"
	}
})

module.exports = Nav
