(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var BarflyApp = React.createClass({displayName: "BarflyApp",
	getInitialState: function () {
		return {
			profile: null,
			currentBar: null
		}
	},
	render: function () {
		if (this.state.profile) {
			return (
				React.createElement("div", null, 
					React.createElement("nav", {className: "navbar navbar-default navbar-fixed-top"}, 
						React.createElement("div", {className: "container"}, 
							React.createElement(BarSelector, {currentBar: this.state.currentBar}), 
							React.createElement("ul", {className: "nav navbar-nav navbar-right"}, 
								React.createElement("li", {className: "navbar-text"}, "Hi there, ", this.state.profile.given_name, "!"), 
								React.createElement("li", {className: "navbar-text", onClick: this.signOut}, "Sign out")
							)
						)
					)
				)
			)
		}
		else {
			return (React.createElement("h1", null, "Loading..."))
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
var BarSelector = React.createClass({displayName: "BarSelector",
	getInitialState: function () {
		return {
			showModal: false
		}
	},
	render: function () {
		if (!this.props.currentBar) {
			return (
				React.createElement("div", null, 
					React.createElement("div", {className: "navbar-form navbar-left"}, 
						React.createElement("button", {type: "button", "data-toggle": "modal", "data-target": "#newBarModal", className: "btn btn-default"}, "Add a new Bar")
					)
				)
			)
		}
		else {
			return (
				React.createElement("ul", {className: "nav navbar-nav"}, 
					React.createElement("li", {className: "dropdown"}, 
						React.createElement("a", {href: "#", className: "dropdown-toggle", "data-toggle": "dropdown", role: "button", "aria-haspopup": "true", "aria-expanded": "false"}, this.props.currentBar, " ", React.createElement("span", {className: "caret"})), 
						React.createElement("ul", {className: "dropdown-menu"}, 
							React.createElement("li", null, React.createElement("a", {href: "#"}, "Action"))
						)
					)
				)
			)
		}
	},
	componentWillMount: function () {
	},
	openNewBarModal: function () {

	}
})
module.exports = BarflyApp

},{}],2:[function(require,module,exports){
var BarflyApp = require('./barflyApp');

var BarflyMain = React.createClass({displayName: "BarflyMain",
	render: function () {
		if (this.state.idToken) {
			return (
				React.createElement("div", null, 
					React.createElement(BarflyApp, {lock: this.lock, idToken: this.state.idToken, apiUrl: this.state.apiUrl})
				)
			);
		}
		else {
			return (
				React.createElement("div", null, 
					React.createElement("h1", null, "Welcome to Barfly"), 
					React.createElement("a", {onClick: this.showLock}, "Sign in")
				)
			);
		}
	},
	componentWillMount: function() {
		this.lock = new Auth0Lock('JeIT5hdK0PXWuMVE1GSYbDT4Uw2HQpKx', 'barfly.auth0.com');
		this.setState({idToken: this.getIdToken()})

		// whatever, there's got to be a better way to do this
		if ((window.location.hostname == "barflyorders.com") || (window.location.hostname == "www.barflyorders.com")) {
			var apiUrl = "https://api.barflyorders.com"
		}
		else {
			var apiUrl = "http://localhost:1310"
		}

		this.setState({apiUrl: apiUrl})

	},
	getIdToken: function () {
		var idToken = localStorage.getItem("access_jwt")
		var authHash = this.lock.parseHash(window.location.hash)
		if (!idToken && authHash) {
			if (authHash.id_token) {
				idToken = authHash.id_token
				// this is correct - we want to store and use the full JWT, not just the "access_token" in the authHash
				localStorage.setItem("access_jwt", authHash.id_token)
				localStorage.setItem("refresh_token", authHash.refresh_token)
				// this is pretty hacky - get rid of the hash when the page gets redirected.
				window.location.hash = ""
			}
			if (authHash.error){
				console.log("Error signing in with authHash:", authHash);
				return null
			}
		}
		return idToken
	},
	showLock: function () {
		this.lock.show({ authParams: { scope: "openid offline_access user_id given_name app_metadata"}})
	}
})

ReactDOM.render(
	React.createElement(BarflyMain, null),
	document.getElementById('content')
)

},{"./barflyApp":1}]},{},[2]);
