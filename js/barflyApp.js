var React = require('react');

var BarflyApp = React.createClass({
	getInitialState: function () {
		return {
			profile: null,
			currentBar: null
		}
	},
	render: function () {
		if (this.state.profile) {
			return (
				<div>
					<nav className="navbar navbar-default navbar-fixed-top">
						<div className = "container">
							<BarSelector currentBar = {this.state.currentBar}/>
							<ul className = "nav navbar-nav navbar-right">
								<li className = "navbar-text">Hi there, {this.state.profile.given_name}!</li>
								<li className = "navbar-text" onClick={this.signOut}>Sign out</li>
							</ul>
						</div>
					</nav>
				</div>
			)
		}
		else {
			return (<h1>Loading...</h1>)
		}
	},
	componentWillMount: function () {
		$(document).ajaxError(function (event, request, settings) {
			this.refreshToken(function () {
				console.log("refreshed token, retrying call...");
				settings["headers"]["Authorization"] = "Bearer " + localStorage.getItem("access_jwt")
				$.ajax(settings)
			})
		}.bind(this))
	},
	refreshToken: function (cb) {
		this.props.lock.getClient().refreshToken(localStorage.getItem("refresh_token"), function (err, delegationResult) {
			if (!err) {
				// this is correct - store and use the full JWT, not the "access_token" in the authHash
				localStorage.setItem("access_jwt", delegationResult.id_token)
				cb()
			}
			else {
				this.signOut()
			}
		}.bind(this))
	},
	signOut: function () {
		localStorage.removeItem("access_jwt")
		localStorage.removeItem("refresh_token")
		window.location.href = "/"
	},
	componentDidMount: function () {
		this.props.lock.getProfile(localStorage.getItem("access_jwt"), function (err, profile) {
			if (err) {
				this.refreshToken(function () {
					this.componentDidMount()
				}.bind(this))
				return
			}
			else {
				this.setState({profile: profile})
			}
		}.bind(this))
		this.loadOrders()
	},
	loadOrders: function () {
		$.ajax({
			url: this.props.apiUrl + "/orders",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			success:
				function (data) {
					console.log(data);
				}.bind(this)
		})
	}
})
var BarSelector = React.createClass({
	getInitialState: function () {
		return {
			showModal: false
		}
	},
	render: function () {
		if (!this.props.currentBar) {
			return (
				<div>
					<div className="navbar-form navbar-left">
						<button type = "button" data-toggle = "modal" data-target = "#newBarModal" className="btn btn-default">Add a new Bar</button>
					</div>
				</div>
			)
		}
		else {
			return (
				<ul className = "nav navbar-nav">
					<li className = "dropdown">
						<a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{this.props.currentBar} <span className="caret"></span></a>
						<ul className = "dropdown-menu">
							<li><a href="#">Action</a></li>
						</ul>
					</li>
				</ul>
			)
		}
	},
	componentWillMount: function () {
	},
	openNewBarModal: function () {

	}
})
module.exports = BarflyApp
