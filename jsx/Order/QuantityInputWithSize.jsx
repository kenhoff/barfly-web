var React = require('react');
import {
	Button,
	Glyphicon,
	Input,
	FormControls,
	Row,
	Col,
	ListGroupItem
} from 'react-bootstrap';
var SizeDescription = require('../_shared/SizeDescription.jsx');

var QuantityInputWithSize = React.createClass({
	propTypes: {
		// shouldn't have inStarredList or inOrderList - should be handled by the Order
		quantity: React.PropTypes.number, // TODO: should be required - we'll get there
		sizeID: React.PropTypes.number
	},
	getInitialState: function() {
		return ({quantity: this.props.quantity});
	},
	render: function() {
		if (this.props.inStarredProductsList && !this.props.starred) {
			return (<div/>);
		} else if (this.props.inOrderList && (!this.props.quantity || (this.props.quantity <= 0))) {
			return (<div/>);
		} else if (this.props.disabled) {
			return (<FormControls.Static label={this.state.containerName + ", " + this.state.packagingName} placeholder="0" type="number" value={this.state.quantity}/>);
		} else {
			var minusButton = <Button onClick={this.decrement}>-</Button>;
			var plusButton = <Button onClick={this.increment}>+</Button>;

			return (
				<ListGroupItem>
					<Row>
						<Col sm={8} xs={6} smPush={3}>
							<label><SizeDescription sizeID={this.props.sizeID}/></label>
						</Col>
						<Col sm={1} xs={6} smPush={3}>
							<Button onClick={this.changeStarred} className="pull-right" active={this.props.starred}>
								<Glyphicon glyph="star"/>
							</Button>
						</Col>
						<Col sm={3} xs={12} smPull={9}>
							<Input buttonBefore={minusButton} buttonAfter={plusButton} placeholder="0" type="number" value={this.state.quantity} onChange={this.handleInputChange}/>
						</Col>
					</Row>
				</ListGroupItem>
			);
		}
	},
	componentDidMount: function() {
		// change negative or zero quantities to null
		if (this.props.quantity <= 0) {
			this.setState({quantity: null});
		}
	},
	componentWillReceiveProps: function(nextProps) {
		// change negative or zero quantities to null
		if (nextProps.quantity <= 0) {
			this.setState({quantity: null});
		} else {
			this.setState({quantity: nextProps.quantity});
		}

	},
	handleInputChange: function(event) {
		this.changeQuantity(event.target.value.replace(/[^0-9]/g, "").trim());
	},
	changeQuantity: function(quantity) {
		// clean up event.target.value - make it into a number
		if (!quantity || quantity == "") {
			this.props.changeQuantity(0);
		} else {
			this.props.changeQuantity(parseInt(quantity));
		}
	},
	increment: function() {
		if (!this.state.quantity || (this.state.quantity == 0)) {
			this.changeQuantity(1);
		} else {
			this.changeQuantity(parseInt(this.state.quantity) + 1);
		}
	},
	decrement: function() {
		if (!this.state.quantity || (this.state.quantity == 0)) {
			// this.changeQuantity(1)
			// do nothing
		} else if (this.state.quantity == 1) {
			this.changeQuantity(0);
		} else {
			this.changeQuantity(parseInt(this.state.quantity) - 1);
		}
	},
	changeStarred: function() {
		this.props.changeStarred({
			newStarredValue: !this.props.starred,
			sizeID: this.props.sizeID
		});
	}
});

module.exports = QuantityInputWithSize;
