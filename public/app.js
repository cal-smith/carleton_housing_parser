var store = window.localStorage;
var housing = {
	zones: [],
	types: [],
	level: "",
	add: function(zone){
		if (housing.zones.contains(zone)) {
			var zones = housing.zones.delete(zone);
			e(zone).classList.remove("selected");
			store.setItem("zones", zones);
			housing.zones = zones;
		} else {
			e(zone).classList.add("selected");
			housing.zones.push(zone);
			store.setItem("zones", housing.zones);
		}
	},

	type: function(type){
		if (housing.types.contains(type)) {
			var types = housing.types.delete(type);
			e(type).classList.remove("selected");
			store.setItem("types", types);
			housing.types = types;
		} else {
			e(type).classList.add("selected");
			housing.types.push(type);
			store.setItem("types", housing.types);
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
		housing.level = level;
		store.setItem("furnished", level);
	},

	limit: function(){
		var host = window.location.host;
		var price = e("price").value;
		if (!price){
			price = "all";
		}
		store.setItem("price", price);
		var zones = housing.zones.join("&") ? housing.zones.join("&") : "all";
		var furnished = housing.level ? housing.level : "all";
		var type = housing.types.join("&") ? housing.types.join("&") : "all";
		var url = "http://" + host + "/limit/" + zones + "/" + price + "/" + furnished + "/" + type;
		window.location = url;
	},

	init: function(){
		if (store.getItem("zones")) {
			var zones = store.getItem("zones");
			zones = zones.split(',');
			housing.zones = zones;
			zones.each(function(v){
				e(v).classList.add("selected");
			});
		}
		
		if (store.getItem("types")){
			var types = store.getItem("types");
			types = types.split(',');
			housing.types = types;
			types.each(function(v){
				e(v).classList.add("selected");
			});
		} else {
			//e("all").classList.add("selected");
			store.setItem("types", "all");
		}
		
		if (store.getItem("furnished")){
			var furnished = store.getItem("furnished");
			housing.level = furnished;
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
			var price = store.getItem("price")
			e("price").value = price;
		}
	}
}
housing.init();