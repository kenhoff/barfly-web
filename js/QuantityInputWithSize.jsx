var React = require('react');
$ = require('jquery')

var QuantityInputWithSize = React.createClass({
	getInitialState: function() {
		return {sizeName: "", quantity: this.props.quantity};
	},
	render: function() {
		minusButton = <Button onClick={this.decrement}>-</Button>
		plusButton = <Button onClick={this.increment}>+</Button>

		return (<Input label={this.state.sizeName} buttonBefore={minusButton} buttonAfter={plusButton} placeholder="0" type="number" value={this.state.quantity} onChange={this.handleInputChange}/>)
	},
	componentDidMount: function() {
		// resolve size
		$.ajax({
			url: window.API_URL + "/sizes/" + this.props.sizeID,
			method: "GET",
			success: function(size) {
				this.setState({sizeName: size.sizeName})
			}.bind(this)
		})
		// change negative or zero quantities to null
		if (this.props.quantity <= 0) {
			this.setState({quantity: null})
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

	}
});

module.exports = QuantityInputWithSize
