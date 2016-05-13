var React = require('react');

var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Panel = require('react-bootstrap').Panel;

var DistributorField = require('./DistributorField.jsx');
var RepField = require('./RepField.jsx');
var SizeList = require('./SizeList.jsx');

var bartender = require('../Bartender.jsx');

var connect = require('react-redux').connect;

var ProductCard = React.createClass({
	propTypes: {
		productID: React.PropTypes.number.isRequired,
		barID: React.PropTypes.number.isRequired,
		productName: React.PropTypes.string
	},
	getInitialState: function() {
		return ({productName: "", distributorID: null, distributorName: null, repID: null, repName: null});
	},
	render: function() {
		// console.log(bartender.store.getState());
		if (this.props.inStarredProductsList && (this.props.starredSizes.length == 0)) {
			return (<div/>);
		} else if ((this.props.inOrderList) && (this.props.quantities.length == 0)) {
			return (<div/>);
		} else if (!this.state.productName.toLowerCase().includes(this.props.searchText.toLowerCase())) {
			return (<div/>);
		} else {
			return (
				<Panel className={(this.props.inStarredProductsList
					? "starredProductCard"
					: "")}>
					<Row>
						<Col xs={12} sm={4}>
							<p>
								<b>{this.props.productName}</b>
							</p>
						</Col>
						<Col xs={12} sm={4}>
							<DistributorField barID={this.props.barID} productID={this.props.productID} productName={this.props.productName} changeDistributor={this.handleDistributorChange} reresolveOrder={this.props.reresolveOrder}/>
						</Col>
						<Col xs={12} sm={4}>
							{this.state.distributorID
								? <RepField barID={this.props.barID} distributorID={this.state.distributorID} distributorName={this.state.distributorName} reresolveOrder={this.props.reresolveOrder} changeRep={this.handleRepChange}/>
								: null}
						</Col>
					</Row>
					<Row>
						<Col xs={12}>
							{(this.state.distributorID && this.state.repID)
								? <SizeList inStarredProductsList={this.props.inStarredProductsList} inOrderList={this.props.inOrderList} starredSizes={this.props.starredSizes} productID={this.props.productID} productName={this.props.productName} quantities={this.props.quantities} changeQuantity={this.handleQuantityChange.bind(this, this.props.productID)} disabled={this.props.disabled} changeStarred={this.handleStarredChange}/>
								: null}
						</Col>
					</Row>
				</Panel>
			);
		}
	},
	handleQuantityChange: function(productID, productSizeID, productQuantity) {
		// for some reason this is necessary - trying to bind directly to this.props.changeQuantity causes React to get cranky :(
		this.props.changeQuantity(productID, productSizeID, productQuantity);
	},
	handleDistributorChange: function(distributorID, distributorName) {
		this.setState({distributorID: distributorID, distributorName: distributorName});
	},
	handleRepChange: function(repID, repName) {
		this.setState({repID: repID, repName: repName});
	},
	componentDidMount: function() {
		// if productName is null, resolve, and dispatch action
		if (!this.props.productName) {
			this.props.getProduct();
		}
	},
	handleStarredChange: function(starredChange) {
		starredChange.productID = this.props.productID;
		this.props.changeStarred(starredChange);
	}
});

var mapStateToProps = function(state, ownProps) {
	if (("products" in state) && (ownProps.productID in state.products)) {
		return {
			productName: state.products[ownProps.productID].productName
		};
	} else {
		return {productName: null};
	}
};

var mapDispatchToProps = function(dispatch, ownProps) {
	return {
		getProduct: function() {
			bartender.resolve({collection: "products", id: ownProps.productID});
		}
	};

};

var ConnectedProductCard = connect(mapStateToProps, mapDispatchToProps)(ProductCard);

module.exports = ConnectedProductCard;
