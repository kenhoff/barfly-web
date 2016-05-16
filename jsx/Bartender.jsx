// state should look like:
// state = {
// 	products: {
// 		1: {...}
// 	}
// }

var $ = require("jquery");

module.exports = {
	store: {},
	resolvingList: [],
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

					this.store.dispatch({type: "UPDATE_PRODUCTS", products: productObject});
					popObjectOffResolvingList(object, this.resolvingList);
				}
			});
		} else if (object.collection == "products") {
			$.ajax({
				url: process.env.BURLOCK_API_URL + "/products/" + object.id,
				method: "GET",
				success: (product) => {
					this.store.dispatch({type: "UPDATE_PRODUCT", product: product});
					// when async request for object returns, pop off of inProgressList
					popObjectOffResolvingList(object, this.resolvingList);
				}
			});
		} else if (object.collection == "distributors") {
			$.ajax({
				url: process.env.BURLOCK_API_URL + "/distributors/" + object.id,
				method: "GET",
				success: (distributor) => {
					// console.log("Resolved", object.collection, object.id, ", dispatching action");
					this.store.dispatch({type: "UPDATE_COLLECTION", collection: object.collection, object: distributor});
					// when async request for object returns, pop off of inProgressList
					// TODO: this doesn't work. split this out into popObjectOffResolvingList
					popObjectOffResolvingList(object, this.resolvingList);
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
