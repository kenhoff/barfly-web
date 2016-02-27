var React = require('react');
var PropTypes = React.PropTypes;
var Modal = require('react-bootstrap').Modal;

var AddNewSizeModal = React.createClass({

	render: function() {
		return (
			<Modal show={this.props.showModal} onHide={this.props.onHide} ref="AddNewSizeModal">
				<Modal.Header closeButton>
					<Modal.Title>Looks like we don't have all the sizes for&nbsp;{this.props.productName}&nbsp;yet. Mind helping us out?</Modal.Title>
				</Modal.Header>
				<Modal.Body></Modal.Body>
				<Modal.Footer>
					<button className="btn btn-default" onClick={this.props.onHide}>Cancel</button>
					<button className="btn btn-primary" onClick={this.submitRep}>Save size</button>
				</Modal.Footer>
			</Modal>
		);
	}

});

module.exports = AddNewSizeModal;
