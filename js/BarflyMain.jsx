var React = require('react');
var ReactDOM = require('react-dom');

window.jQuery = window.$ = require('jquery');
require("bootstrap")

var BarflyApp = require('./BarflyApp.jsx');

var BarflyMain = React.createClass({
	render: function() {
		if (this.state.idToken) {
			return (
				<div>
					<BarflyApp lock={this.lock} idToken={this.state.idToken}/>
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

ReactDOM.render(< BarflyMain />, document.getElementById('content'))
