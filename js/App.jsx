var React = require('react');
var BarSelector = require('./BarSelector.jsx');

window.jQuery = window.$ = require('jquery');

var App = React.createClass({
	getInitialState: function() {
		return {profile: null, currentBar: null, bars: []}
	},
	render: function() {
		if (this.state.profile) {
			return (
				<div>
					<nav className="navbar navbar-default navbar-fixed-top">
						<div className="container">
							<BarSelector currentBar={this.state.currentBar} bars={this.state.bars} onBarChange={this.handleBarChange}/>
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
	handleBarChange: function() {
		console.log("hallo");
		this.loadBars()
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
		this.loadBars()
	},
	loadBars: function() {
		$.ajax({
			url: window.API_URL + "/user/bars",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			success: function(data) {
				if (data.length != 0) {
					console.log("updating state");
					this.setState({bars: data, currentBar: data[0]})
					console.log(this.state);
				}
			}.bind(this)
		})
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

module.exports = App
