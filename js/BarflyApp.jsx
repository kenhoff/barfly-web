var React = require('react');
var BarSelector = require('./BarSelector.jsx');

window.jQuery = window.$ = require('jquery');

var BarflyApp = React.createClass({
	getInitialState: function() {
		return {profile: null, currentBar: null}
	},
	render: function() {
		if (this.state.profile) {
			return (
				<div>
					<nav className="navbar navbar-default navbar-fixed-top">
						<div className="container">
							<BarSelector currentBar={this.state.currentBar}/>
							<ul className="nav navbar-nav navbar-right">
								<li className="navbar-text">Hi there, 
									{this.state.profile.given_name}!</li>
								<li className="navbar-text" onClick={this.signOut}>Sign out</li>
							</ul>
						</div>
					</nav>
				</div>
			)
		} else {
			return (
				<h1>Loading...</h1>
			)
		}
	},
	componentWillMount: function() {
		$(document).ajaxError(function(event, request, settings) {
			if (request.status == 401) {
				this.refreshToken(function() {
					console.log("refreshed token, retrying call...");
					settings["headers"]["Authorization"] = "Bearer " + localStorage.getItem("access_jwt")
					$.ajax(settings)
				})
			}
		}.bind(this))
	},
	refreshToken: function(cb) {
		this.props.lock.getClient().refreshToken(localStorage.getItem("refresh_token"), function(err, delegationResult) {
			if (!err) {
				// this is correct - store and use the full JWT, not the "access_token" in the authHash
				localStorage.setItem("access_jwt", delegationResult.id_token)
				cb()
			} else {
				this.signOut()
			}
		}.bind(this))
	},
	signOut: function() {
		localStorage.removeItem("access_jwt")
		localStorage.removeItem("refresh_token")
		window.location.href = "/"
	},
	componentDidMount: function() {
		this.props.lock.getProfile(localStorage.getItem("access_jwt"), function(err, profile) {
			if (err) {
				this.refreshToken(function() {
					this.componentDidMount()
				}.bind(this))
				return
			} else {
				this.setState({profile: profile})
			}
		}.bind(this))
		this.loadOrders()
	},
	loadOrders: function() {
		$.ajax({
			url: window.API_URL + "/legacy_orders",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			success: function(data) {
				console.log(data);
			}.bind(this)
		})
	}
})

module.exports = BarflyApp
