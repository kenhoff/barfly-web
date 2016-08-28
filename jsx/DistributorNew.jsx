import React from "react";
import {connect} from "react-redux";
import AppNav from "./AppNav/AppNav.jsx";
import bartender from "./Bartender.jsx";
import {browserHistory} from "react-router";

class DistributorNew extends React.Component {
	constructor(props) {
		super(props);
		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.state = {
			distributorName: "",
			buttonEnabled: false,
			submitting: false
		};
	}
	render() {
		var button;
		if (this.state.submitting) {
			button = (
				<button className="barfly primary" onClick={this.handleSubmit} disabled>{"Creating Distributor... "}
					<i className="fa fa-spinner fa-pulse fa-fw"></i>
				</button>
			);
		} else {
			button = (
				<button className="barfly primary" onClick={this.handleSubmit} disabled={!this.state.buttonEnabled}>{"Create Distributor "}
					<i className="fa fa-truck" aria-hidden="true"></i>
				</button>
			);
		}
		return (
			<div>
				<AppNav backURL="/distributors" backText="Distributors"></AppNav>
				<div className="barflyContainer newDistributor">
					<h1>Create New Distributor</h1>
					<form action="" onSubmit={this.handleSubmit}>
						<label>
							{"What's the name of the distributor?"}
							<input type="text" placeholder="Cold Creek Distribution" value={this.state.distributorName} onChange={this.handleNameChange}></input>
						</label>
						{button}
					</form>
				</div>
			</div>
		);
	}
	handleNameChange(e) {
		var buttonEnabled = false;
		if (e.target.value.trim() != "") {
			buttonEnabled = true;
		}
		this.setState({distributorName: e.target.value, buttonEnabled: buttonEnabled});
	}
	handleSubmit(e) {
		e.preventDefault();
		if (this.state.buttonEnabled && !this.state.submitting) {
			this.setState({
				submitting: true
			}, () => {
				bartender.createNewDistributor(this.state.distributorName.trim(), () => {
					browserHistory.push("/distributors");
				});
			});
		}
	}
}

var DistributorNew_Connected = connect()(DistributorNew);

export default DistributorNew_Connected;
