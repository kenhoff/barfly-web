import React, {PropTypes} from "react";
import {connect} from "react-redux";
import bartender from "./Bartender.jsx";

class BarName_Presentational extends React.Component {
	render() {
		return (
			<span>{this.props.barName}</span>
		);
	}
}
BarName_Presentational.propTypes = {
	barName: PropTypes.string,
	barID: PropTypes.number.isRequired
};

var mapStateToProps = function(state, ownProps) {
	var props = {};
	if ("barID" in ownProps) {
		if (("bars" in state) && (ownProps.barID in state.bars)) {
			props.barName = state.bars[ownProps.barID].barName;
		} else {
			bartender.resolve({collection: "bars", id: ownProps.barID});
		}
	}
	return props;
};

var BarName_Container = connect(mapStateToProps)(BarName_Presentational);

export default BarName_Container;
