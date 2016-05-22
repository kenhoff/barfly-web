var React = require('react');
var connect = require('react-redux').connect;

var bartender = require('../Bartender.jsx');

var PresentationalPackagingName = React.createClass({
	propTypes: {
		packagingID: React.PropTypes.number.isRequired,
		packagingName: React.PropTypes.string
	},
	getDefaultProps: function() {
		return {packagingName: ""};
	},
	render: function() {
		return (
			<span>{this.props.packagingName}</span>
		);
	}
});

var mapStateToProps = function(state, ownProps) {
	let props = {};
	if (("packaging" in state) && (ownProps.packagingID in state.packaging)) {
		props.packagingName = state.packaging[ownProps.packagingID].packagingName;
	} else {
		bartender.resolve({collection: "packaging", id: ownProps.packagingID});
	}
	return props;
};

var ContainerPackagingName = connect(mapStateToProps)(PresentationalPackagingName);

module.exports = ContainerPackagingName;
