/*
Sapphire.js
github.com/hansolo669/Sapphire
*/

"use strict";

var Sapphire = {};

var S = Sapphire;
/*
*
* Arrays
*
*/

//non-patching
Sapphire.val = function(ctx){
	if (ctx.indexOf(value) !== -1){
		return ctx.indexOf(value);
	} else {
		return false;
	}
}

Sapphire.shuffle = function(ctx){
	for (var i = 0; i < ctx.length; i++) {
		var e = ctx[i];
		ctx.splice(i, 1);
		var rnd = Math.random() * ctx.length | 0;
		ctx.splice(rnd, 0, e);
	}
	return ctx;
}

Sapphire.delete = function(ctx, d){//
	function check(newarray){
		if (newarray.indexOf(d) !== -1 ){
			newarray.splice(newarray.indexOf(d), 1);
			check(newarray);
		} else {
			return newarray;
		}
	}
	check(ctx);
}

Sapphire.cycle = function(ctx, times, callback){
	if (typeof times !== "undefined") {
		for (var i = 0; i < times; i++) {
			for (var k = 0; k < ctx.length; k++) {
				return callback(ctx[k]);
			}
		}
	} else {
		while(true){
			for (var i = 0; i < ctx.length; i++) {
				return callback(ctx[i]);
			}
		}
	}
}

Sapphire.compact = function(ctx){//
	for (var i = 0; i < ctx.length; i++) {
		if (ctx[i] === null || typeof ctx[i] === "undefined" || ctx[i] === "undefined"){
			ctx.splice(ctx[i], 1)
		}
		return ctx;
	}
}

Sapphire.joins = function(ctx, sep){
	if (typeof sep !== "undefined") {
		var string = "";
		for (var i = 0; i < ctx.length; i++) {
			i === ctx.length - 1 ? string += ctx[i] : string += ctx[i] + sep;
		}
		return string;
	} else {
		var string = "";
		for (var i = 0; i < ctx.length; i++) {
			string += ctx[i];
		}
		return string;
	}
}

Sapphire.sample = function(ctx, n){
	if (typeof n !== "undefined") {
		var res = [];
		for (var i = 0; i < n; i++) {
			var rnd = Math.random() * ctx.length | 0;
			res.push(ctx[rnd]);
		}
		return res;
	} else {
		var rnd = Math.random() * ctx.length | 0;
		return ctx[rnd];
	}
}

//patching functions
if(!Array.prototype.val){
	Array.prototype.val = function(value){//returns the position of a given value, or false
		return Sapphire.val(this);
	};
}

if(!Array.prototype.shuffle){
	Object.defineProperty(Array.prototype, "shuffle", {//shuffles a given array
		get: function(){
			return Sapphire.shuffle(this);
		}
	});
}

//.delete(d) -> deletes all items equal to d and returns a new array
if (!Array.prototype.delete){
	Array.prototype.delete = function(d){
		Sapphire.delete(this, d);
		return this;
	};
}

if(!Array.prototype.cycle){
	Array.prototype.cycle = function(callback, times){//loops over the array either inifinitly or so many [times] calling calback each time
		return Sapphire.cycle(this, times, callback);
	};
}

//.compact -> removes any null/undefined values
if (!Array.prototype.compact) {
	Object.defineProperty(Array.prototype, "compact", {
		get: function(){
			return Sapphire.compact(this);
		}
	});
}

if (!Array.prototype.joins) { //returns a string of all the elements in the array, optionally seperated by [seperator]
	Object.prototype.joins = function(sep){
		return Sapphire.joins(this, sep)
	};
}

if (!Array.prototype.sample) {
	Array.prototype.sample = function(n){//returns either a random element or [number] random elements in an array
		return Sapphire.sample(this, n);
	};
}
/*
*
* Arrays + Objects
*
*/

//non-patching functions
Sapphire.each = function(ctx, callback){
	if (Array.isArray(ctx) || ctx.toString() === "[object HTMLCollection]") {//HTMLCollection uses the same style methods as array
		for (var i = 0; i < ctx.length; i++) {
			callback(ctx[i], i);//calls the callback once for each element in the array
		}
	} else {
		for (var i = 0; i < Object.keys(ctx).length; i++) {
			var k = Object.keys(ctx)[i];//key
			var v = ctx[Object.keys(ctx)[i]];//value
			callback(k, v);//calls the callback once for each key. first argument is the key, second argument is the value
		}
	}
	return ctx;
}

Sapphire.last = function(ctx){
	if (ctx.toString() === "[object Object]") {
		var k = Object.keys(ctx);
		var p = k.length - 1;
		return ctx[k[p]];
	} else {
		var p = ctx.length - 1;
		return ctx[p];
	}
}

Sapphire.first = function(ctx){
	if (ctx.toString() === "[object Object]") {
		var k = Object.keys(ctx);
		return ctx[k[0]];
	} else {
		return ctx[0];
	}
}

Sapphire.contains = function(ctx, search){
	if (ctx.toString() === "[object Object]") {
		return ctx.hasOwnProperty(search);
	} else{
		if (ctx.indexOf(search) !== -1) {
			return true;
		} else {
			return false;
		}
	}
}

Sapphire.empty = function(ctx){
	if (ctx.toString() === "[object Object]") {

	} else{
		if (ctx.length === 0) {
			return true;
		} else {
			return false;
		}
	}
}

Sapphire.times = function(ctx, callback){
	for (var i = 0; i < Object.keys(ctx).length; i++) {
		callback();	
	}
}

//patching functions
if(!Object.prototype.each){
	Object.prototype.each = function(callback){//iterator for objects or arrays
		return Sapphire.each(this, callback);
	};
}

if(!Object.prototype.last){
	Object.defineProperty(Object.prototype, "last", {//returns the last value of an object/last element in an array
		get: function(){
			return Sapphire.last(this);
		}
	});
}

if(!Object.prototype.first){
	Object.defineProperty(Object.prototype, "first", {//returns the first value of an object/first element in an array
		get: function(){
			return Sapphire.first(this);
		}
	});
}

if(!Object.prototype.contains){
	Object.prototype.contains = function(search){//checks if objects and arrays contain the search term. returns true/false.
		return Sapphire.contains(this, search);
	};
}

if (!Object.prototype.empty){
	Object.defineProperty(Object.prototype, "empty", {//returns true if array/obj contains nothing
		get: function(){
			return Sapphire.empty(this);
		}
	});
}

if (!Object.prototype.times){
	Object.prototype.times = function(callback){//calls [callback] "num" times
		return Sapphire.times(this, callback);
	};
}
/*
*
* Browser speficic code. Stuff that requires a window or dom
*
*/
if (window) {
	window.c = function(e){//gets an element array by class
		return document.getElementsByClassName(e);
	};

	window.t = function(e){//gets element array by tag
		return document.getElementsByTagName(e);
	};

	window.e = window.i = function(e){//gets element by id
		return document.getElementById(e);
	};

	window.n = function(e){//gets element array by name attribute
		return document.getElementsByName(e);
	};

	if(!Object.prototype.sleep){
		window.sleep = function(callback, delay){//wraps setTimeout, and defaults to sleeping in seconds rather than miliseconds.
			delay = delay * 1000;
			return window.setTimeout(callback, delay);
		};
	}

	document.addEventListener("DOMContentLoaded", function(){
		//innerHTML and innerText just go together. textContent is cool, but innerText is where it's at.
		if (typeof document.body.innerText === "undefined") {
			Object.defineProperty(Node.prototype, "innerText", {
				get: function(){ return this.textContent; },
				set: function(t){ this.textContent = t; }
			});
		}
	});
}
/*
*
* Events
*
*/

//non-patching
Sapphire.on = function(ctx, type, callback, capture){
	ctx.addEventListener(type, callback, capture);
	return ctx;
}

Sapphire.off = function(ctx, type, callback, capture){
	ctx.removeEventListener(type, callback, capture);
	return ctx;
}

//patching functions
//borrowing a little from jquery/backbone here. .on and .off are just so succinct.
if(!Object.prototype.on){
	Object.prototype.on = function(type, callback, capture){
		return Sapphire.on(this, type, callback, capture);
	};
}

if(!Object.prototype.off){
	Object.prototype.off = function(type, callback, capture){
		return Sapphire.off(this, type, callback, capture);
	};
}
/*
*
* Numbers
*
*/

//non-patching
Sapphire.even = function(ctx){
	if (Number(ctx).valueOf() % 2 === 0 || -0){
		return true;
	} else {
		return false;
	}
}

Sapphire.odd = function(ctx){
	if (Number(ctx).valueOf() % 2 === 0 || -0){
		return false;
	} else {
		return true;
	}
}

Sapphire.next = function(ctx){
	return Number(ctx) + 1;
}

Sapphire.round = function(ctx){
	return ctx | 0;
}

//patching functions
if(!Object.prototype.even){
	Object.defineProperty(Object.prototype, "even", {//returns true if a given number is even
		get: function(){
			return Sapphire.even(this);
		}
	});
}

if(!Object.prototype.odd){
	Object.defineProperty(Object.prototype, "odd", {//returns true if a given number is odd
		get: function(){
			return Sapphire.odd(this);
		}
	});
}

if(!Object.prototype.next){
	Object.defineProperty(Object.prototype, "next", {//returns number++
		get: function(){
			return Sapphire.next(this);
		}
	});
}

if(!Object.prototype.round){
	Object.defineProperty(Object.prototype, "round", {//basically Math.floor. rounds a decimal to a whole
		get: function(){
			return Sapphire.round(this);
		}
	});
}
/*
*
* Objects
*
*/

//non patching functions
Sapphire.key = function(ctx, value, ret_true){//returns the key for a given value
	for (var i = 0; i < Object.keys(ctx).length; i++) {
		var k = Object.keys(ctx)[i];//key
		var v = ctx[Object.keys(ctx)[i]];//value
		if (v === value){
			if (ret_true) {
				return true;
			} else{
				return k;
			}
		}
	}
	return false;
};

Sapphire.val = function(ctx, value){//returns true if there exists a given value
	return Sapphire.key(ctx, value, true);
}

Sapphire.values = function(ctx){
	var array = [];
	for (var i = 0; i < Object.keys(ctx).length; i++) {//returns an array of the objects values
		var v = ctx[Object.keys(ctx)[i]];
		array.push(v);
	}
	return array;
}

Sapphire.parse = function(ctx){//wrapper for the standard JSON.parse
	return JSON.parse(ctx);
}

Sapphire.merge = function(ctx, objs){
	
}

//patching functions
if(!Object.prototype.key){
	Object.prototype.key = function(val){//returns the key for a given value
		return Sapphire.key(this, val);
	};
}

if(!Object.prototype.val){
	Object.prototype.val = function(val){//returns true if there exists a given value
		return Sapphire.val(this, val);
	};
}

if(!Object.prototype.values){
	Object.defineProperty(Object.prototype, "values", {//returns an array of the objects values
		get: function(){
			return Sapphire.values(this);
		}
	});
}

if(!Object.prototype.parse){
	Object.defineProperty(Object.prototype, "parse", { //wrapper for the standard JSON.parse
		get: function(){
			return Sapphire.parse(this);
		}
	});
}

//.merge([objects]) -> merges objects into the main object preffering the originals values when a conflict occurs
if(!Object.prototype.merge){
	Object.prototype.merge = function(objs){
		return Sapphire.merge(this, objs)
	}
}
/*
*
* Strings 
*
*/

//non-patching
Sapphire.match = function(ctx){
	return str.match(ctx);
}

Sapphire.lowercase = function(ctx){
	return ctx.toLowerCase();
}

Sapphire.uppercase = function(ctx){
	return ctx.toUpperCase();
}

Sapphire.capitalize = function(ctx){
	var str = ctx.toLowerCase();
	str = str.split("");
	str[0] = str[0].toUpperCase();
	str = S.joins(str);
	return str;
}

Sapphire.eachs = function(ctx, callback){
	var letters = ctx.split("");
	for (var i = 0; i < letters.length; i++) {
		callback(letters[i]);
	}
}

//patching functions
if(!Object.prototype.match){
	Object.prototype.match = function (str) {//flips the standard match object around, the standard match object is not overwritten as it inherets from String, not Object.
		return Sapphire.match(this);
	};
}

if (!String.prototype.lowercase) {
	Object.defineProperty(String.prototype, "lowercase", {//converts all chacters to lowercase
		get: function(){
			return Sapphire.lowercase(this);	
		}
	});
}

if (!String.prototype.uppercase) {
	Object.defineProperty(String.prototype, "uppercase", {//converts all chacters to uppercase
		get: function(){
			return Sapphire.uppercase(this);
		}
	});
}

if (!String.prototype.capitalize) {
	Object.defineProperty(String.prototype, "capitalize", {//convertes the first character to upper case, and the remainder to lower case
		get: function(){
			return Sapphire.capitalize(this);
		}
	});
}
//.swapcase -> converts uppercase to lowercase and lowercase to uppercase
//if([A-Z]) str[i].toupper if([a-z])str[i].tolower

if (!String.prototype.eachs) {
	String.prototype.eachs = function(callback){//calls callback for every chacter and includes the character as the first argument
		return Sapphire.eachs(this, callback);
	}
}

