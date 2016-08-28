var React = require("react");
var connect = require("react-redux").connect;

var bartender = require("../Bartender.jsx");

var DistributorName_Presentational = React.createClass({
	propTypes: {
		distributorID: React.PropTypes.number.isRequired,
		distributorName: React.PropTypes.string
	},
	render: function() {
		return (
			<span>{this.props.distributorName}</span>
		);
	}
});

var mapStateToProps = function(state, ownProps) {
	var props = {};
	if ("distributors" in state) {
		props.distributorName = state.distributors[ownProps.distributorID].distributorName;
	} else {
		// resolve all distributors
		bartender.resolve("distributors");
	}
	return props;
};

var DistributorName_Container = connect(mapStateToProps)(DistributorName_Presentational);

module.exports = DistributorName_Container;
