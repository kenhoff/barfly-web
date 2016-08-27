var React = require("react");

import AppNav from "../AppNav/AppNav.jsx";

var AccountPhoneInput = require("./AccountPhoneInput.jsx");
// var PaymentMethodField = require('./PaymentMethodField.jsx');
// var SubscriptionField = require('./SubscriptionField.jsx');

var Account = React.createClass({

	render: function() {
		return (
			<div>
				<AppNav></AppNav>
				<div className="account">
					<h1>Account</h1>
					<AccountPhoneInput/>
				</div>
			</div>
		);
	}
	// 		<PaymentMethodField/>
	// 		<SubscriptionField/>
});

module.exports = Account;
