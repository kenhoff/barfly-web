var React = require('react');
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var Col = require('react-bootstrap').Col;

var $ = require('jquery');

var connect = require('react-redux').connect;

var AccountPhoneInput = React.createClass({
	componentDidMount: function() {
		this.props.getPhoneNumber();
	},
	render: function() {
		return (
			<Col xs={12}>
				<h4>Phone</h4>
				<Input onChange={this.handleChange} type="number" placeholder="3038826490" value={this.props.phoneDraft}/> {(this.props.phone != this.props.phoneDraft
					? <Button onClick={this.handleSave} bsStyle="primary">Save</Button>
					: <div/>)}

			</Col>
		);
	},
	handleChange: function(event) {
		this.props.updatePhoneDraft(event.target.value);
	},
	handleSave: function() {
		this.props.savePhoneNumber(this.props.phoneDraft);
	}
});

var mapStateToProps = function(state = {}) {
	return {phone: state.phone, phoneDraft: state.phoneDraft};
};
var mapDispatchToProps = function(dispatch) {
	return {
		getPhoneNumber: function() {
			$.ajax({
				url: process.env.BURLOCK_API_URL + "/user",
				method: "GET",
				headers: {
					"Authorization": "Bearer " + localStorage.getItem("access_jwt")
				},
				success: function(user) {
					if ("user_metadata" in user) {
						dispatch({type: "UPDATE_PHONE", phone: user.user_metadata.phone});
					} else {
						dispatch({type: "UPDATE_PHONE", phone: null});
					}
				}.bind(this)
			});
		},
		savePhoneNumber: function(phone) {
			$.ajax({
				url: process.env.BURLOCK_API_URL + "/user",
				method: "PATCH",
				data: {
					phone: phone
				},
				headers: {
					"Authorization": "Bearer " + localStorage.getItem("access_jwt")
				},
				success: function() {
					dispatch({type: "UPDATE_PHONE", phone});
				}.bind(this)
			});
		},
		updatePhoneDraft: function(phoneDraft) {
			dispatch({type: "UPDATE_PHONE_DRAFT", phoneDraft});
		}
	};
};

var ConnectedAccountPhoneInput = connect(mapStateToProps, mapDispatchToProps)(AccountPhoneInput);

module.exports = ConnectedAccountPhoneInput;
