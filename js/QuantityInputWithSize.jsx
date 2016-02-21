var React = require('react');
$ = require('jquery')
var Button = require("react-bootstrap").Button
var Glyphicon = require("react-bootstrap").Glyphicon
var ButtonInput = require("react-bootstrap").ButtonInput
var Input = require("react-bootstrap").Input
var FormControls = require("react-bootstrap").FormControls
var Row = require("react-bootstrap").Row
var Col = require("react-bootstrap").Col
var ListGroupItem = require('react-bootstrap').ListGroupItem;

var QuantityInputWithSize = React.createClass({
	getInitialState: function() {
		return ({sizeName: "", quantity: this.props.quantity, containerName: "", packagingName: ""})
	},
	render: function() {
		if (this.props.inStarredProductsList && !this.props.starred) {
			return (<div/>)
		} else if (this.props.disabled) {
			return (<FormControls.Static label={this.state.containerName + ", " + this.state.packagingName} placeholder="0" type="number" value={this.state.quantity}/>)
		} else {
			minusButton = <Button onClick={this.decrement}>-</Button>
			plusButton = <Button onClick={this.increment}>+</Button>

			starButton = <span className="glyphicon glyphicon-star"/>

			return (
				<ListGroupItem>
					<Row>
						<Col sm={8} xs={6} smPush={3}>
							<label>{this.state.containerName + ", " + this.state.packagingName}</label>
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
			)
		}
	},
	componentDidMount: function() {
		// resolve size (container & packaging)
		this.getContainerAndPackagingID(function(err, size) {
			this.getContainerName(size.containerID, function(err, containerName) {
				this.setState({containerName: containerName})
			}.bind(this))
			this.getPackagingName(size.packagingID, function(err, packagingName) {
				this.setState({packagingName: packagingName});
			}.bind(this))
		}.bind(this))

		// change negative or zero quantities to null
		if (this.props.quantity <= 0) {
			this.setState({quantity: null})
		}
	},
	getContainerAndPackagingID: function(cb) {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/sizes/" + this.props.sizeID,
			method: "GET",
			success: function(size) {
				cb(null, size)
			}.bind(this)
		})
	},
	getContainerName: function(containerID, cb) {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/containers/" + containerID,
			method: "GET",
			success: function(container) {
				cb(null, container.containerName)
			}
		})
	},
	getPackagingName: function(packagingID, cb) {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/packaging/" + packagingID,
			method: "GET",
			success: function(packaging) {
				cb(null, packaging.packagingName)
			}
		})
	},
	componentWillReceiveProps: function(nextProps) {
		// change negative or zero quantities to null
		if (nextProps.quantity <= 0) {
			this.setState({quantity: null})
		} else {
			this.setState({quantity: nextProps.quantity})
		}

	},
	handleInputChange: function(event) {
		this.changeQuantity(event.target.value.replace(/[^0-9]/g, "").trim())
	},
	changeQuantity: function(quantity) {
		// clean up event.target.value - make it into a number
		if (!quantity || quantity == "") {
			this.props.changeQuantity(0)
		} else {
			this.props.changeQuantity(parseInt(quantity))
		}
	},
	increment: function() {
		if (!this.state.quantity || (this.state.quantity == 0)) {
			this.changeQuantity(1)
		} else {
			this.changeQuantity(parseInt(this.state.quantity) + 1)
		}
	},
	decrement: function() {
		if (!this.state.quantity || (this.state.quantity == 0)) {
			// this.changeQuantity(1)
			// do nothing
		} else if (this.state.quantity == 1) {
			this.changeQuantity(0)
		} else {
			this.changeQuantity(parseInt(this.state.quantity) - 1)
		}
	},
	changeStarred: function() {
		this.props.changeStarred({
			newStarredValue: !this.props.starred,
			sizeID: this.props.sizeID
		})
	}
});

module.exports = QuantityInputWithSize
