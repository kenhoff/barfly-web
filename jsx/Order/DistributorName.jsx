var React = require('react');
var connect = require('react-redux').connect;

var bartender = require('../Bartender.jsx');

var DistributorNameContainer = React.createClass({
	propTypes: {
		distributorID: React.PropTypes.number.isRequired,
		distributorName: React.PropTypes.string
	},
	render: function() {
		return (
			<span>{this.props.distributorName}</span>
		);
	},
	componentDidMount: function() {
		if (!("distributorName" in this.props)) {
			bartender.resolve({collection: "distributors", id: this.props.distributorID});
		}
	}
});

var mapStateToProps = function(state, ownProps) {
	if (("distributors" in state) && (ownProps.distributorID in state.distributors)) {
		return {
			distributorName: state.distributors[ownProps.distributorID].distributorName
		};
	} else {
		return {};
	}
};

var DistributorName = connect(mapStateToProps)(DistributorNameContainer);

module.exports = DistributorName;
