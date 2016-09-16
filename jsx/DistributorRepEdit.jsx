import React from "react";
import AppNav from "./AppNav/AppNav.jsx";
import {connect} from "react-redux";
import bartender from "./Bartender.jsx";
import {browserHistory} from "react-router";

class DistributorRepEdit extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			submitting: false,
			buttonEnabled: false,
			repName: props.repName,
			repPhone: props.repPhone
		};
		this.handleNameChange = this.handleNameChange.bind(this);
		this.handlePhoneChange = this.handlePhoneChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	render() {
		var button;
		if (this.state.submitting) {
			button = (
				<button className="barfly primary" disabled>{"Saving rep... "}
					<i className="fa fa-spinner fa-pulse fa-fw"></i>
				</button>
			);
		} else {
			button = (
				<button className="barfly primary" onClick={this.handleSubmit} disabled={!this.state.buttonEnabled}>{"Save rep "}
					<i className="fa fa-user" aria-hidden="true"></i>
				</button>
			);
		}
		return (
			<div>
				<AppNav backURL={"/distributors/" + this.props.routeParams.distributorID + "/reps/" + this.props.routeParams.repID} backText={this.props.distributorName + " Reps"}></AppNav>
				<div className="barflyContainer editRep">
					<h1>Edit Rep</h1>
					<form action="" onSubmit={this.handleSubmit}>
						<label>
							{"What's your rep's name?"}
							<input type="text" placeholder="Ramblin' Rodriguez" value={this.state.repName} onChange={this.handleNameChange}></input>
						</label>
						<label>
							{"What's your rep's phone number?"}
							<input type="tel" placeholder="(303)-555-1234" value={this.state.repPhone} onChange={this.handlePhoneChange}></input>
						</label>
						{button}
					</form>
				</div>
			</div>
		);
	}
	handleNameChange(e) {
		this.setState({
			repName: e.target.value
		}, () => {
			this.updateButtonEnabled();
		});
	}
	handlePhoneChange(e) {
		this.setState({
			repPhone: e.target.value.replace(/[^0-9]/g, "").slice(0, 10)
		}, () => {
			this.updateButtonEnabled();
		});
	}
	updateButtonEnabled() {
		if ((this.state.repName.trim() != "") && (this.state.repPhone.length == 10)) {
			this.setState({buttonEnabled: true});
		} else {
			this.setState({buttonEnabled: false});
		}
	}
	handleSubmit(e) {
		e.preventDefault();
		if (this.state.buttonEnabled) {
			this.setState({
				submitting: true
			}, () => {
				bartender.editRep(this.state.repName, this.state.repPhone, this.props.routeParams.repID, () => {
					browserHistory.push("/distributors/" + this.props.routeParams.distributorID + "/reps/" + this.props.routeParams.repID);
				});
			});
		}
	}
}

var mapStateToProps = function(state, ownProps) {
	var props = {};
	if ("distributors" in state && ownProps.routeParams.distributorID in state.distributors) {
		props.distributorName = state.distributors[ownProps.routeParams.distributorID].distributorName;
	} else {
		// resolve all distributors
		bartender.resolve("distributors");
	}

	if (("reps" in state) && (ownProps.routeParams.repID in state.reps)) {
		props.repPhone = state.reps[ownProps.routeParams.repID].user_metadata.phone;
		props.repName = state.reps[ownProps.routeParams.repID].user_metadata.name;

	} else {
		bartender.resolve({collection: "reps", id: ownProps.routeParams.repID});
	}
	return props;
};

var DistributorRepEdit_Connected = connect(mapStateToProps)(DistributorRepEdit);

export default DistributorRepEdit_Connected;
