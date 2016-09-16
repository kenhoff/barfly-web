import React, {PropTypes} from "react";
import {connect} from "react-redux";
import bartender from "./Bartender.jsx";

class RepPhone extends React.Component {
	render() {
		return (
			<span>{this.props.repPhone}</span>
		);
	}
}

RepPhone.propTypes = {
	repID: PropTypes.string.isRequired,
	repPhone: PropTypes.string
};

RepPhone.defaultProps = {
	repPhone: ""
};

var mapStateToProps = function(state, ownProps) {
	let props = {};
	if (("reps" in state) && (ownProps.repID in state.reps)) {
		props.repPhone = state.reps[ownProps.repID].user_metadata.phone;
	} else {
		bartender.resolve({collection: "reps", id: ownProps.repID});
	}
	return props;
};

var RepPhone_Connected = connect(mapStateToProps)(RepPhone);

export default RepPhone_Connected;
