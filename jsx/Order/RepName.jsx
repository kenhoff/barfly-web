var React = require('react');
import {connect} from 'react-redux';

var bartender = require('../Bartender.jsx');

var RepName = React.createClass({
	propTypes: {
		repID: React.PropTypes.number.isRequired,
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
		props.repName = state.reps[ownProps.repID].repName;
	} else {
		bartender.resolve({collection: "reps", id: ownProps.repID});
	}
	return props;
};

var ConnectedRepName = connect(mapStateToProps)(RepName);

module.exports = ConnectedRepName;
