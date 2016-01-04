var React = require('react');
var ReactDOM = require('react-dom');

var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;
var Redirect = require('react-router').Redirect;

var createBrowserHistory = require('history/lib/createBrowserHistory');

window.jQuery = window.$ = require('jquery');
require("bootstrap")

var App = require('./App.jsx');
var Nav = require('./Nav.jsx');

var Main = React.createClass({

	// if we haven't loaded a bar yet, currentBar == null.
	// if there isn't a currentBar available (e.g. a user hasn't created a bar yet) then currentBar == -1.
	getInitialState: function() {
		return {currentBar: null}
	},
	render: function() {
		if (this.state.idToken) {
			return (
				<div>
					<Nav currentBar={this.state.currentBar} changeBar={this.handleBarChange}/>
					<App bar={this.state.currentBar}/>
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
					settings["headers"]["Authorization"] = "Bearer " + localStorage.getItem("access_jwt")
					$.ajax(settings)
				})
			}
		}.bind(this))
	},
	refreshToken: function(cb) {
		this.lock.getClient().refreshToken(localStorage.getItem("refresh_token"), function(err, delegationResult) {
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
	},
	handleBarChange: function(barID) {
		console.log("context change to", barID)
		this.setState({currentBar: barID})
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
	}
})

var MainRouter = React.createClass({
	render: function() {
		return (
			<Router history={createBrowserHistory()}>
				<Redirect from="/" to="/orders"/>
				<Route path="/orders" component={Main}/>
			</Router>
		);
	}
});

ReactDOM.render(< MainRouter />, document.getElementById('content'))
