define(function () {
	var BarflyApp = React.createClass({
		getInitialState: function () {
			return {
				profile: null,
				orders: []
			}
		},
		render: function () {
			if (this.state.profile) {
				return (
					<div>
						<nav className="navbar navbar-default navbar-fixed-top">
							<div className = "container">
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
					console.log(profile);
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
						this.setState({orders: data})
					}.bind(this)
			})
		}
	})
	return BarflyApp
})
