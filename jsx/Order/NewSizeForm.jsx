var React = require('react');

var Button = require('react-bootstrap').Button;
var AddNewSizeModal = require('./AddNewSizeModal.jsx');

var NewSizeForm = React.createClass({
	getInitialState: function() {
		var state = {
			showAddNewSizeModal: false,
			containers: [],
			packaging: [],
			newSizeButtonEnabled: false
		};
		return state;
	},
	render: function() {
		return (
			<div>
				<Button bsStyle="link" bsSize="xsmall" onClick={function() {
					this.setState({showAddNewSizeModal: true});
				}.bind(this)} className={this.state.showNewSizeForm
					? "hidden"
					: "show"}>Add new size for&nbsp;{this.props.productName}</Button>
				<AddNewSizeModal showModal={this.state.showAddNewSizeModal} onHide={function() {
					this.setState({showAddNewSizeModal: false});
				}.bind(this)} productName={this.props.productName} productID={this.props.productID} refreshSizes={this.props.refreshSizes}></AddNewSizeModal>
			</div>
		);
	}
});

module.exports = NewSizeForm;
