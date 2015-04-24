var store = window.localStorage;
var housing = {
	add: function(zone){
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
		var types = store.getItem("types");
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
		var url = window.location.origin + "/limit/?zone=" + encodeURIComponent(zones) + "&price=" + price + "&furnished=" + furnished + "&type=" + encodeURIComponent(type);
		window.location = url;
	},

	init: function(){
		if (store.getItem("zones")) {
			var zones = store.getItem("zones").split(',');
			zones.each(function(v){
				e(v).classList.add("selected");
			});
		} else {
			store.setItem("zones", "all");
		}
		
		if (store.getItem("types")){
			var types = store.getItem("types").split(',');
			types.each(function(v){
				e(v).classList.add("selected");
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
	}
}
housing.init();