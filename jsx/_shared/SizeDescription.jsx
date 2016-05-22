var React = require('react');

import {connect} from 'react-redux';

var bartender = require('../Bartender.jsx');
var ContainerName = require('../Order/ContainerName.jsx');
var PackagingName = require('../Order/PackagingName.jsx');

var PresentationalSizeDescription = React.createClass({
	propTypes: {
		sizeID: React.PropTypes.number,
		containerID: React.PropTypes.number,
		packagingID: React.PropTypes.number
	},
	render: function() {
		if (("containerID" in this.props) && ("packagingID" in this.props)) {
			return (
				<span><ContainerName containerID={this.props.containerID}/>{", "}<PackagingName packagingID={this.props.packagingID}/></span>
			);
		} else {
			return (
				<span></span>
			);
		}
	}
});

var mapStateToProps = function(state, ownProps) {
	let props = {};
	if (("sizes" in state) && (ownProps.sizeID in state.sizes)) {
		props.containerID = state.sizes[ownProps.sizeID].containerID;
		props.packagingID = state.sizes[ownProps.sizeID].packagingID;
	} else {
		bartender.resolve({collection: "sizes", id: ownProps.sizeID});
	}
	return props;
};

var ContainerSizeDescription = connect(mapStateToProps)(PresentationalSizeDescription);

module.exports = ContainerSizeDescription;
