

// Stupid, hacky shit that I hate. for the time being, this allows us to require react modules with the JSX compiler.
// stolen from https://github.com/philix/jsx-requirejs-plugin
requirejs.config({
	paths: {
		"react": "react-with-addons",
		"JSXTransformer": "JSXTransformer"
	}
})

requirejs(["jsx!barflyApp"], function (BarflyApp) {
	var BarflyMain = React.createClass({
		render: function () {
			if (this.state.idToken) {
				return (
					<BarflyApp lock={this.lock} idToken={this.state.idToken} apiUrl={this.state.apiUrl}/>
				);
			}
			else {
				return (
					<a onClick={this.showLock}>Show Lock</a>
				);
			}
		},
		componentWillMount: function() {
			this.lock = new Auth0Lock('JeIT5hdK0PXWuMVE1GSYbDT4Uw2HQpKx', 'barfly.auth0.com');
			this.setState({idToken: this.getIdToken()})

			// whatever, there's got to be a better way to do this
			if ((window.location.hostname == "https://barflyorders.com/") || (window.location.hostname == "https://www.barflyorders.com/")) {
				var apiUrl = "https://api.barflyorders.com/"
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
			this.lock.show({ authParams: { scope: "openid offline_access"}})
		}
	})


	ReactDOM.render(
		<BarflyMain />,
		document.getElementById('content')
	)
})
