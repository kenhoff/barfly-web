var React = require('react');
var connect = require('react-redux').connect;

var bartender = require('../Bartender.jsx');

var PresentationalContainerName = React.createClass({
	propTypes: {
		containerID: React.PropTypes.number.isRequired,
		containerName: React.PropTypes.string
	},
	render: function() {
		return (
			<span>{this.props.containerName}</span>
		);
	}
});

var mapStateToProps = function(state, ownProps) {
	if (("containers" in state) && (ownProps.containerID in state.containers)) {
		return {
			containerName: state.containers[ownProps.containerID].containerName
		};
	} else {
		bartender.resolve({collection: "containers", id: ownProps.containerID});
		return {containerName: ""};
	}
};

var ContainerContainerName = connect(mapStateToProps)(PresentationalContainerName);

module.exports = ContainerContainerName;
