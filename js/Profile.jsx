var React = require('react');

var ProfilePhoneInput = require('./ProfilePhoneInput.jsx');

var Profile = React.createClass({

	render: function() {
		return (
			<div>
				<h1>Profile</h1>
				<ProfilePhoneInput />
			</div>
		);
	}

});

module.exports = Profile
