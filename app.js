var BarflyMain = React.createClass({
	render: function () {
		if (this.state.idToken) {
			return (
				<div>
					Welcome!
				</div>
			);
		}
		else {
			return (
				<div>
				<a onClick={this.showLock}>Show Lock</a>
				</div>
			);
		}
	},
	componentWillMount: function() {
		this.lock = new Auth0Lock('JeIT5hdK0PXWuMVE1GSYbDT4Uw2HQpKx', 'barfly.auth0.com');
		this.setState({idToken: this.getIdToken()})
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
