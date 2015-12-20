define(function () {
	var BarflyApp = React.createClass({
		render: function () {
			return (
				<div>
					Hello again!
				</div>
			)
		},
		componentWillMount: function () {
			$(document).ajaxError(function (event, request, settings) {
				this.refreshToken(function () {
					console.log("refreshed token!");
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
			})
		},
		signOut: function () {
			localStorage.removeItem("access_jwt")
			localStorage.removeItem("refresh_token")
			window.location.href = "/"
		},
		componentDidMount: function () {
			this.loadOrders()
		},
		loadOrders: function () {
			console.log("calling api...");
			$.ajax({
				url: "http://localhost:1310/orders",
				headers: {
					"Authorization": "Bearer " + localStorage.getItem("access_jwt")
				},
				success:
					function (data) {
						console.log("success!");
						console.log(data);
						this.setState({orders: data})
					}.bind(this)
			})
		}
	})
	return BarflyApp
})
