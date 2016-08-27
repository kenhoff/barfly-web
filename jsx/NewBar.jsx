import React from "react";
import {connect} from "react-redux";

import AppNav from "./AppNav/AppNav.jsx";

import bartender from "./Bartender.jsx";

class NewBar_Presentational extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			barName: "",
			barZip: "",
			buttonEnabled: false
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleZipChange = this.handleZipChange.bind(this);
		this.updateButtonState = this.updateButtonState.bind(this);
	}
	handleNameChange(e) {
		this.setState({
			barName: e.target.value
		}, () => {
			this.updateButtonState();
		});
	}
	handleZipChange(e) {
		var newValue = e.target.value.replace(/[^0-9]/g, "").slice(0, 5);
		this.setState({
			barZip: newValue
		}, () => {
			this.updateButtonState();
		});
	}
	updateButtonState() {
		if ((this.state.barName == "") || (this.state.barZip.length != 5)) {
			this.setState({buttonEnabled: false});
		} else {
			this.setState({buttonEnabled: true});
		}
	}
	handleSubmit(e) {
		e.preventDefault();
		if (this.state.buttonEnabled) {
			// submit new bar
			if (this.state.buttonEnabled) {
				bartender.submitNewBar(this.state.barName.trim(), this.state.barZip);
			}
		}
	}
	render() {
		return (
			<div>
				<AppNav backURL="/bars" backText="bars"></AppNav>
				<div className="newBar">
					<h1>New Bar</h1>
					<form action="" onSubmit={this.handleSubmit}>
						<label>{"What's the name of your bar?"}
							<input type="text" placeholder={"Burlock & Barrel"} onChange={this.handleNameChange} value={this.state.barName}></input>
						</label>
						<label>{"What zip code is your bar in?"}
							<input type="number" placeholder={"80302"} onChange={this.handleZipChange} value={this.state.barZip}></input>
						</label>
						<button className="barfly primary" onClick={this.handleSubmit} disabled={!this.state.buttonEnabled}>Create bar</button>
					</form>
				</div>
			</div>
		);
	}
}

var NewBar_Container = connect()(NewBar_Presentational);

export default NewBar_Container;
