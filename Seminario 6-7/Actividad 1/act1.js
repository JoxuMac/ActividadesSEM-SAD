var fs = require('fs');
/*var rolodexFile = fs.open('My rollodex file', 'w', function(err, file){
	if(err)throw err;
});*/
var rolodexFile = {
	a: 'We know a',
	b: 'We know b',
	c: 'We know c'
};
var rolodex = {a: 'We know this name'};

function retrieve(file, name, cb){
	cb(file[name]);
}

function processEntry(name, cb){
	var p = new Promise(function(res){
		if(rolodex[name]){
			res(rolodex[name]);
		}else {
			retrieve(rolodexFile, name, function(value) {
				rolodex[name]=value;
				res(value);
			});
		}
	});
	
	return p;
}

function test() {
	testName.forEach(function(name){
		console.log('processing', name);
		processEntry(name)
			.then(function (res){
				console.log('processed', name);
			});
	});
}

var testName = ['a', 'b', 'c'];

test();