import React, {PropTypes} from "react";
import {connect} from "react-redux";
import AppNav from "./AppNav/AppNav.jsx";
import bartender from "./Bartender.jsx";
import {browserHistory} from "react-router";

class DistributorList_Presentational extends React.Component {
	render() {
		// sort distributors array here (also allows for sorting via specific method later, using state)
		var distributors = this.props.distributors.sort((a, b) => {
			if (a.distributorName.toLowerCase() > b.distributorName.toLowerCase()) {
				return 1;
			} else {
				return -1;
			}
		});

		return (
			<div>
				<AppNav></AppNav>
				<div className="barflyContainer">
					<h1>Distributors</h1>
					<div className="barfly list">
						{distributors.map((distributor) => {
							return (
								<div key={Math.random()}>
									<div className="listItemContents">
										<h4>
											{distributor.distributorName}
										</h4>
									</div>
								</div>
							);
						})}
					</div>
					<button className="barfly primary" onClick={() => {
						browserHistory.push("/distributors/new");
					}}>{"Create Distributor "}
						<i className="fa fa-truck" aria-hidden="true"></i>
					</button>
				</div>
			</div>
		);
	}
}

DistributorList_Presentational.propTypes = {
	distributors: PropTypes.arrayOf(PropTypes.shape({id: PropTypes.number, distributorName: PropTypes.string}))
};

DistributorList_Presentational.defaultProps = {
	distributors: []
};

var mapStateToProps = function(state) {
	var props = {};
	if ("distributors" in state) {
		var distributorsArray = [];
		// convert distributors object to distributors array here
		for (var distributor in state.distributors) {
			if (state.distributors.hasOwnProperty(distributor)) {
				distributorsArray.push(state.distributors[distributor]);
			}
		}
		props.distributors = distributorsArray;
	} else {
		// resolve all distributors
		bartender.resolve("distributors");
	}

	return props;
};

var DistributorList_Container = connect(mapStateToProps)(DistributorList_Presentational);

export default DistributorList_Container;
