var React = require('react');
import {connect} from 'react-redux';

var bartender = require('../Bartender.jsx');

var RepName = React.createClass({
	propTypes: {
		repID: React.PropTypes.string.isRequired, // auth0 string
		repName: React.PropTypes.string
	},
	render: function() {
		return (
			<span>{this.props.repName}</span>
		);
	}
});

var mapStateToProps = function(state, ownProps) {
	let props = {};
	if (("reps" in state) && (ownProps.repID in state.reps)) {
		props.repName = state.reps[ownProps.repID].user_metadata.name;
	} else {
		bartender.resolve({collection: "reps", id: ownProps.repID});
	}
	return props;
};

var ConnectedRepName = connect(mapStateToProps)(RepName);

module.exports = ConnectedRepName;
