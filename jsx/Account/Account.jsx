var React = require('react');

var Grid = require('react-bootstrap').Grid;
var Col = require('react-bootstrap').Col;
var Row = require('react-bootstrap').Row;
var PageHeader = require('react-bootstrap').PageHeader;
var Panel = require('react-bootstrap').Panel;

var AccountPhoneInput = require('./AccountPhoneInput.jsx');
// var PaymentMethodField = require('./PaymentMethodField.jsx');
// var SubscriptionField = require('./SubscriptionField.jsx');

var Account = React.createClass({

	render: function() {
		return (
			<Grid className="app">
				<Row>
					<Col xs={12}>
						<PageHeader>Account</PageHeader>
					</Col>
				</Row>
				<Row>
					<Panel>
						<AccountPhoneInput/>
					</Panel>
				</Row>
			</Grid>
		);
	}

	// <Row>
	// 	<Panel>
	// 		<PaymentMethodField/>
	// 	</Panel>
	// </Row>
	// <Row>
	// 	<Panel>
	// 		<SubscriptionField/>
	// 	</Panel>
	// </Row>
});

module.exports = Account;
