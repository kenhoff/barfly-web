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
		// console.log("Resolve request:", object.collection, object.id);
		// check if object is in store - if so, return
		if (inState(object, this.store.getState())) {
			// console.log("Found", object.collection, object.id, "in state");
			return;
		}
		// check if object is in resolvingList - if so, return
		if (inResolvingList(object, this.resolvingList)) {
			// console.log("Found", object.collection, object.id, "in resolvingList");
			return;
		}
		// console.log("Did not find", object.collection, object.id, "in state or resolvingList - resolving");
		// push object onto inProgressList
		this.resolvingList.push(object);
		// fire off async request for object
		if (object.collection == "products") {
			$.ajax({
				url: process.env.BURLOCK_API_URL + "/products/" + object.id,
				method: "GET",
				success: (product) => {
					// console.log("Resolved", object.collection, object.id, ", dispatching action");
					this.store.dispatch({type: "UPDATE_PRODUCT", product: product});
					// when async request for object returns, pop off of inProgressList
					// TODO: this doesn't work. split this out into popObjectOffResolvingList
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
	if ((object.collection in state) && object.id in state[object.collection]) {
		return true;
	} else {
		return false;
	}
};

var inResolvingList = function(object, resolvingList) {
	for (var resolvingListObject of resolvingList) {
		if ((resolvingListObject.id == object.id) && (resolvingListObject.collection == object.collection)) {
			return true;
		}
	}
	// (else)
	return false;
};

var popObjectOffResolvingList = function(object, resolvingList) {
	for (var i = 0; i < resolvingList.length; i++) {
		if ((resolvingList[i].id == object.id) && (resolvingList[i].collection == object.collection)) {
			resolvingList.splice(i, 1);
			break;
		}
	}
};
