var store = window.localStorage;
var housing = {
	zones: [],
	add: function(zone){
		if (housing.zones.contains(zone)) {
			console.log(zone);
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
	limit: function(){
		var host = window.location.host;
		var price = e("price").value;
		store.setItem("price", price);
		var zones = housing.zones.join("&");
		var url = "http://" + host + "/limit/" + zones + "/" + price
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
		if (store.getItem("price")) {
			var price = store.getItem("price")
			e("price").value = price;
		}
	}
}
housing.init();