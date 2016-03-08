var React = require('react');

var Grid = require('react-bootstrap').Grid;
var Row = require('react-bootstrap').Row;
var PageHeader = require('react-bootstrap').PageHeader;

var AccountPhoneInput = require('./AccountPhoneInput.jsx');
var PaymentMethodField = require('./PaymentMethodField.jsx');
var SubscriptionField = require('./SubscriptionField.jsx');

var Account = React.createClass({

	render: function() {
		return (
			<Grid className="app">
				<Row>
					<PageHeader>Account</PageHeader>
				</Row>
				<Row>
					<AccountPhoneInput/>
				</Row>
				<br></br>
				<Row>
					<PaymentMethodField/>
				</Row>
				<Row>
					<SubscriptionField/>
				</Row>
			</Grid>
		);
	}

});

module.exports = Account;
