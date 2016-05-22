var $ = require("jquery");
import {browserHistory} from "react-router";

module.exports = {
	store: {},
	resolvingList: [],
	submitNewBar: function(barName, zipCode) {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/user/bars",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			method: "POST",
			data: {
				barName,
				zipCode
			},
			success: (newBar) => {
				// add new bar to list of bar memberships
				this.store.dispatch({type: "ADD_BAR_MEMBERSHIP", barID: newBar.id});
				// add new bar to list of bars
				this.store.dispatch({type: "ADD_NEW_BAR", bar: Object.assign({}, newBar)});
				// change current bar to new bar
				this.store.dispatch({type: "CHANGE_CURRENT_BAR", barID: newBar.id});
				// close modal
				this.store.dispatch({type: "CLOSE_NEW_BAR_MODAL"});
				browserHistory.push("/orders");
			},
			failure: (data) => {
				throw data;
			}
		});
	},
	createNewOrder: function(opts) {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/bars/" + opts.barID + "/orders",
			method: "POST",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			success: (data) => {
				this.store.dispatch({type: "PUSH_NEW_ORDER", barID: opts.barID, orderID: data});
				browserHistory.push("/orders/" + data);
			}
		});
	},
	updateOrder: function(opts) {
		// opts: {orderID, productID, productSizeID, productQuantity}
		// mocking out for now - later will include resetting timeout to save order
		this.store.dispatch(Object.assign({
			type: "UPDATE_ORDER"
		}, opts));
	},
	sendOrder: function(id) {
		// mostly mocked out for now
		// dispatch event to update order as "sent"
		this.store.dispatch({type: "SEND_ORDER", id: id, sentAt: new Date()});
	},
	resolve: function(object) {
		// check if object is in store - if so, return
		if (!object.force) {
			if (inState(object, this.store.getState())) {
				return;
			}
			// check if object is in resolvingList - if so, return
			if (inResolvingList(object, this.resolvingList)) {
				return;
			}
		}
		// push object onto inProgressList
		this.resolvingList.push(object);
		// fire off async request for object
		if (object == "products") {
			$.ajax({
				url: process.env.BURLOCK_API_URL + "/products",
				// (no auth needed)
				method: "GET",
				success: (products) => {
					products.sort(function(a, b) {
						if (a.productName.toLowerCase() > b.productName.toLowerCase()) {
							return 1;
						} else if (a.productName.toLowerCase() < b.productName.toLowerCase()) {
							return -1;
						} else {
							return 0;
						}
					});
					// convert from array to object with IDs
					var productObject = {};
					for (var product of products) {
						productObject[product.productID] = product;
					}

					this.store.dispatch({type: "UPDATE_COLLECTION", collection: object, newCollection: productObject});
					popObjectOffResolvingList(object, this.resolvingList);
				}
			});
		} else if (object == "bar_memberships") {
			$.ajax({
				url: process.env.BURLOCK_API_URL + "/user/bars",
				headers: {
					"Authorization": "Bearer " + localStorage.getItem("access_jwt")
				},
				success: (bars) => {
					this.store.dispatch({type: "UPDATE_COLLECTION", collection: object, newCollection: bars});
					this.store.dispatch({type: "INITIALIZE_CURRENT_BAR"});
					popObjectOffResolvingList(object, this.resolvingList);
				}
			});
		} else if (object.collection == "products") {
			$.ajax({
				url: process.env.BURLOCK_API_URL + "/products/" + object.id,
				method: "GET",
				success: (product) => {
					this.store.dispatch({type: "UPDATE_COLLECTION", collection: object.collection, object: product});
					// when async request for object returns, pop off of inProgressList
					popObjectOffResolvingList(object, this.resolvingList);
				}
			});
		} else if (object.collection == "distributors") {
			$.ajax({
				url: process.env.BURLOCK_API_URL + "/distributors/" + object.id,
				method: "GET",
				success: (distributor) => {
					this.store.dispatch({type: "UPDATE_COLLECTION", collection: object.collection, object: distributor});
					popObjectOffResolvingList(object, this.resolvingList);
				}
			});
		} else if (object.collection == "bars") {
			$.ajax({
				url: process.env.BURLOCK_API_URL + "/bars/" + object.id,
				headers: {
					"Authorization": "Bearer " + localStorage.getItem("access_jwt")
				},
				success: (barInfo) => {
					this.store.dispatch({type: "UPDATE_COLLECTION", collection: object.collection, object: barInfo});
					popObjectOffResolvingList(object, this.resolvingList);
				}
			});
		} else if (object.collection == "bar_orders") {
			$.ajax({
				url: process.env.BURLOCK_API_URL + "/bars/" + object.id + "/orders",
				headers: {
					"Authorization": "Bearer " + localStorage.getItem("access_jwt")
				},
				success: (orders) => {
					var orderIDs = [];
					for (var order of orders) {
						orderIDs.push(order.id);
					}
					// for the record - i'm setting a key/value pair within an array here
					orderIDs.id = object.id;
					this.store.dispatch({type: "UPDATE_COLLECTION", collection: object.collection, object: orderIDs});
				}
			});
		} else if (object.collection == "orders") {
			$.ajax({
				url: process.env.BURLOCK_API_URL + "/bars/" + object.bar + "/orders/" + object.id,
				headers: {
					"Authorization": "Bearer " + localStorage.getItem("access_jwt")
				},
				method: "GET",
				success: (data) => {
					// handle if sent isn't actually in the order yet
					// dispatch
					data.id = object.id;
					this.store.dispatch({type: "UPDATE_COLLECTION", collection: object.collection, object: data});
					// this.setState({
					// 	productOrders: data.productOrders,
					// 	sent: (data.sent || false)
					// });
				}
			});
		} else if (object.collection == "sizes") {
			$.ajax({
				url: process.env.BURLOCK_API_URL + "/sizes/" + object.id,
				method: "GET",
				success: (size) => {
					this.store.dispatch({type: "UPDATE_COLLECTION", collection: object.collection, object: size});
				}
			});
		} else if (object.collection == "containers") {
			$.ajax({
				url: process.env.BURLOCK_API_URL + "/containers/" + object.id,
				method: "GET",
				success: (container) => {
					this.store.dispatch({type: "UPDATE_COLLECTION", collection: object.collection, object: container});
				}
			});
		} else if (object.collection == "packaging") {
			$.ajax({
				url: process.env.BURLOCK_API_URL + "/packaging/" + object.id,
				method: "GET",
				success: (packaging) => {
					this.store.dispatch({type: "UPDATE_COLLECTION", collection: object.collection, object: packaging});
				}
			});
		}
	}
};

var inState = function(object, state) {
	if (typeof object == "string") {
		if (object in state) {
			return true;
		} else {
			return false;
		}
	} else {
		if ((object.collection in state) && object.id in state[object.collection]) {
			return true;
		} else {
			return false;
		}
	}
};

var inResolvingList = function(object, resolvingList) {
	if (typeof object == "string") {
		for (var resolvingListObject of resolvingList) {
			if (resolvingListObject == object) {
				return true;
			}
		}
	} else {
		for (resolvingListObject of resolvingList) {
			if (typeof resolvingListObject != "string") {
				if ((resolvingListObject.id == object.id) && (resolvingListObject.collection == object.collection)) {
					return true;
				}
			}
		}
	}
	// (else)
	return false;
};

var popObjectOffResolvingList = function(object, resolvingList) {
	for (var i = 0; i < resolvingList.length; i++) {
		if (typeof object == "string") {
			if (resolvingList[i] == object) {
				resolvingList.splice(i, 1);
				break;
			}
		} else {
			if ((resolvingList[i].id == object.id) && (resolvingList[i].collection == object.collection)) {
				resolvingList.splice(i, 1);
				break;
			}
		}
	}
};
