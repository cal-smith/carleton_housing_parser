//*sigh*
if(!Object.prototype.each){
	Object.prototype.each = function(callback){
		if (Array.isArray(this) || this.toString() === "[object HTMLCollection]") {
			//HTMLCollection uses the same style methods as array
			for (var i = 0; i < this.length; i++) {
				callback(this[i], i);
			}
		} else {
			//iterating through an object by key
			var keys = Object.keys(this);
			for (var i = 0; i < keys.length; i++) {
				var k = keys[i];
				var v = this[keys[i]];
				callback(k, v);
			}
		}
		return this;
	};
}

//checks if objects and arrays contain the search term. returns true/false.
Object.prototype.contains = function(search){
	if (this.toString() === "[object Object]") {
		return ctx.hasOwnProperty(search);
	} else{
		return this.indexOf(search) !== -1;
	}
};

//.delete(d) -> deletes all items equal to d and returns a new array
if (!Array.prototype.delete){
	Array.prototype.delete = function(d){
		return this.filter(function(e){ return e != d; });
	};
}

window.e = window.i = function(e){//gets element by id
	return document.getElementById(e);
};

window.c = function(e){//gets an element array by class
	return document.getElementsByClassName(e);
};

if(!Object.prototype.on){
	Object.prototype.on = function(type, callback, capture){
		this.addEventListener(type, callback, capture);
		return this;
	};
}

var store = window.localStorage;
var housing = {
	zone: function(zone){
		zone = zone.target.id;
		var zones = store.getItem("zones").split(",");
		if (zones.contains(zone)) {
			var zones = zones.delete(zone);
			e(zone).classList.remove("selected");
			store.setItem("zones", zones);
		} else {
			e(zone).classList.add("selected");
			zones.push(zone);
			store.setItem("zones", zones);
		}
	},

	type: function(type){
		type = type.target.id;
		var types = store.getItem("types").split(",");
		if (types.contains(type)) {
			var types = types.delete(type);
			e(type).classList.remove("selected");
			store.setItem("types", types);
		} else {
			e(type).classList.add("selected");
			types.push(type);
			store.setItem("types", types);
		}
	},

	furnished: function(level){
		level = level.target.id;
		e("true").classList.remove("selected");
		e("false").classList.remove("selected");
		e("allf").classList.remove("selected");
		if (level === "all"){
			e("allf").classList.add("selected");
		} else {
			e(level).classList.add("selected");
		}
		store.setItem("furnished", level);
	},

	limit: function(){
		var price = e("price").value;
		if (!price){
			price = 5000;
		}
		store.setItem("price", price);
		var zones = store.getItem("zones");
		zones = zones.split(",").join("&") ? zones.split(",").join("&") : "all";
		var furnished = store.getItem("furnished");
		var type = store.getItem("types");
		type = type.split(",").join("&") ? type.split(",").join("&") : "all";
		ajax("/limit.json", "get")
		.vars({
			"zone": encodeURIComponent(zones), 
			"price": price, 
			"furnished": furnished, 
			"type": encodeURIComponent(type)})
		.json()
		.send(function(data){
			if (data.length === 0) {
				var empty = document.createElement("div");
				empty.setAttribute("class", "listing");
				empty.textContent = ":( nothing found";
				document.body.replaceChild(empty, c("listing")[0]);
			} else {
				var listing = document.createElement("div");
				listing.setAttribute("class", "listing");
				for (var i = 0; i < data.length; i++) {
					var elem = document.createElement("p");
					elem.innerHTML = data[i].rawhtml;
					listing.appendChild(elem);
				};
				document.body.replaceChild(listing, c("listing")[0]);
			}
		});
	},

	init: function(){
		if (store.getItem("zones")) {
			var zones = store.getItem("zones").split(',');
			zones.each(function(v){
				v !== "all" && e(v).classList.add("selected");
			});
		} else {
			store.setItem("zones", "all");
		}
		
		if (store.getItem("types")){
			var types = store.getItem("types").split(',');
			types.each(function(v){
				v !== "all" && e(v).classList.add("selected");
			});
		} else {
			store.setItem("types", "all");
		}
		
		if (store.getItem("furnished")){
			var furnished = store.getItem("furnished");
			if (furnished === "all"){
				e("allf").classList.add("selected");
			} else {
				e(furnished).classList.add("selected");
			}
		} else {
			e("allf").classList.add("selected");
			store.setItem("furnished", "all");
		}

		if (store.getItem("price")) {
			e("price").value = store.getItem("price");
		} else {
			store.setItem("price", 5000);
		}

		e("zones").children.each(function(e){
			e.on("click", housing.zone);
		});

		e("type").children.each(function(e){
			e.on("click", housing.type);
		});

		e("furnished").children.each(function(e){
			e.on("click", housing.furnished);
		});

		e("limit").on("click", housing.limit);

		this.limit();
	}
}
housing.init();