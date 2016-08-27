/*global Auth0Lock*/

var React = require("react");
var ReactDOM = require("react-dom");
var Provider = require("react-redux").Provider;
var createStore = require("redux").createStore;
var compose = require("redux").compose;
var reducer = require("./Reducer.jsx");

var Router = require("react-router").Router;
var Route = require("react-router").Route;
var browserHistory = require("react-router").browserHistory;
var $ = require("jquery");

var BarContext = require("./BarContext.jsx");
var Orders = require("./OrderList/Orders.jsx");
import Order from "./Order/Order.jsx";
var Catalog = require("./Order/Catalog.jsx");
var Account = require("./Account/Account.jsx");
var Landing = require("./Landing.jsx");
import Bars from "./Bars.jsx";
import NewBar from "./NewBar.jsx";
import NotFound from "./NotFound.jsx";

import Dashboard from "./Dashboard.jsx";

var store = createStore(reducer, {}, compose(window.devToolsExtension
	? window.devToolsExtension()
	: f => f));

var bartender = require("./Bartender.jsx");
bartender.store = store;

var Main = React.createClass({

	// if we haven't loaded a bar yet, currentBar == null.
	// if there isn't a currentBar available (e.g. a user hasn't created a bar yet) then currentBar == -1.
	render: function() {
		if (this.state.idToken) {
			// oh my god, this is stupid, but let me explain.
			// react-router forces us to specify the children that we're going to render as part of our route, but neglects to give us a way to pass ""default"" props to these children - in our case, our "default" props is the barID that we're working with.
			// (the reason we're doing this is so that we have /orders/1234 instead of /bars/1234/orders/1234)
			// so, we basically just clone the child elements and pass props to them manually.
			return (
				<div>
					{this.props.children}
				</div>
			);
		} else {
			return (
				<div className="landing">
					<Landing showLock={this.showLock}/>
				</div>
			);
		}
	},
	componentWillMount: function() {
		this.lock = new Auth0Lock(process.env.AUTH0_CLIENT_ID, process.env.AUTH0_DOMAIN);
		this.setState({
			idToken: this.getIdToken()
		}, function() {

			// get user profile info?

			if (this.state.idToken) {
				// new state is set, if state.idToken, user is logged in and we need to initialize Intercom
				this.lock.getProfile(localStorage.getItem("access_jwt"), function(err, profile) {
					if (err) {
						this.refreshToken(function() {
							this.componentWillMount();
						}.bind(this));
						return;
					} else {
						window.Intercom("boot", {
							app_id: process.env.INTERCOM_APP_ID,
							user_id: profile.sub,
							name: profile.name
						});
					}
				}.bind(this));

			} else {
				window.Intercom("boot", {app_id: "nuxvgj9g"});
			}
		});
		$(document).ajaxError(function(event, request, settings) {
			if (request.status == 401) {
				this.refreshToken(function() {
					settings["headers"]["Authorization"] = "Bearer " + localStorage.getItem("access_jwt");
					$.ajax(settings);
				});
			}
		}.bind(this));
	},
	refreshToken: function(cb) {
		this.lock.getClient().refreshToken(localStorage.getItem("refresh_token"), function(err, delegationResult) {
			if (!err) {
				// this is correct - store and use the full JWT, not the "access_token" in the authHash
				localStorage.setItem("access_jwt", delegationResult.id_token);
				cb();
			} else {
				this.signOut();
			}
		}.bind(this));
	},
	signOut: function() {
		localStorage.removeItem("access_jwt");
		localStorage.removeItem("refresh_token");
		window.location.href = "/";
	},
	getIdToken: function() {
		var idToken = localStorage.getItem("access_jwt");
		var authHash = this.lock.parseHash(window.location.hash);
		if (!idToken && authHash) {
			if (authHash.id_token) {
				idToken = authHash.id_token;
				// this is correct - we want to store and use the full JWT, not just the "access_token" in the authHash
				localStorage.setItem("access_jwt", authHash.id_token);
				if ("refresh_token" in authHash) {
					localStorage.setItem("refresh_token", authHash.refresh_token);
				}
				// this is pretty hacky - get rid of the hash when the page gets redirected.
				window.location.hash = "";
			}
			if (authHash.error) {
				console.log("Error signing in with authHash:", authHash); // eslint-disable-line no-console
				return null;
			}
		}
		return idToken;
	},
	showLock: function() {
		this.lock.show({
			authParams: {
				scope: "openid offline_access user_id given_name name app_metadata"
			},
			connections: ["facebook"]
		});
	}
});

var MainRouter = React.createClass({
	render: function() {
		return (
			<Router history={browserHistory}>
				<Route component={Main}>
					<Route path="/account" component={Account}></Route>
					<Route path="/bars" component={Bars}></Route>
					<Route path="/bars/new" component={NewBar}></Route>
					<Route component={BarContext}>
						<Route path="/" component={Dashboard}/>
						<Route path="/orders" component={Orders}/>
						<Route path="/orders/:orderID" component={Order}></Route>
						<Route path="/orders/:orderID/catalog" component={Catalog}></Route>
					</Route>
					<Route path="*" component={NotFound}></Route>
				</Route>
			</Router>
		);
	}
});

ReactDOM.render((
	<Provider store={store}>
		<MainRouter/>
	</Provider>
), document.getElementById("content"));
