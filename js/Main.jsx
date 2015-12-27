var React = require('react');
var ReactDOM = require('react-dom');

window.jQuery = window.$ = require('jquery');
require("bootstrap")

var App = require('./App.jsx');
var BarContext = require("./BarContext.jsx")

var Main = React.createClass({
	render: function() {
		if (this.state.idToken) {
			return (
				<div>
					<BarContext lock={this.lock} idToken={this.state.idToken}/>
				</div>
			);
		} else {
			return (
				<div>
					<h1>Welcome to Barfly</h1>
					<a onClick={this.showLock}>Sign in</a>
				</div>
			);
		}
	},
	componentWillMount: function() {
		this.lock = new Auth0Lock('JeIT5hdK0PXWuMVE1GSYbDT4Uw2HQpKx', 'barfly.auth0.com');
		this.setState({idToken: this.getIdToken()})

		// whatever, there's got to be a better way to do this
		if ((window.location.hostname == "barflyorders.com") || (window.location.hostname == "www.barflyorders.com")) {
			window.API_URL = "https://api.barflyorders.com"
		} else {
			window.API_URL = "http://localhost:1310"
		}
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
				console.log("refreshed token");
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
	getIdToken: function() {
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
			if (authHash.error) {
				console.log("Error signing in with authHash:", authHash);
				return null
			}
		}
		return idToken
	},
	showLock: function() {
		this.lock.show({
			authParams: {
				scope: "openid offline_access user_id given_name app_metadata"
			}
		})
	}
})

ReactDOM.render(< Main />, document.getElementById('content'))
