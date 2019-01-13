module.exports = (app) => {

	var mongo = require('mongodb');
	var url='mongodb://localhost:27017/almacen'
	var shoppingCart = [];
	
	// INICIO
	app.get('/', (req, res) => {
		mongo.connect(url, function(err, db) {	
			return new Promise(function(resolve, reject) {
				var collection = db.collection('products');
				
				collection.find().toArray(function(err, items) {
					if (err) {
						reject(err);
					} else {
						resolve(res.render('view.ejs', {almacen: items, carrito:shoppingCart}));
					}          
				});
			});
		});
	});
	
	
	// AÑADIR CARRITO
	app.get("/addToCart", function(req, res) {
		return new Promise(function(resolve, reject) {
			mongo.connect(url, function(err, db) {	
				var o_id = new mongo.ObjectID(req.query.id.replace(/['"]+/g, ''));
				var collection = db.collection('products');
						
				collection.findOne({'_id': o_id}, function (err, item) {
					
					if (item.stock > 0) {
						shoppingCart.push(item);
						
						db.collection('products').update(
							{ _id: o_id },
							{
								$set: {
									stock: item.stock-1
								}
							},
							{
								upsert: false,
								multi: true			
							}, function (err, res) {

						});
						
					} else {
						console.log('ERROR: No hay stock del producto', item.desc);
					}
					
					collection.find().toArray(function(err, items) {
						if (err) {
							reject(err);
						} else {
							resolve(res.render('view.ejs', {almacen: items, carrito:shoppingCart}));
						}          
					});
				});
			});
		});
	});
	
	// ELIMINAR CARRITO
	app.get("/removeFromCart", function(req, res) {
		return new Promise(function(resolve, reject) {
			mongo.connect(url, function(err, db) {	
				var o_id = new mongo.ObjectID(req.query.id.replace(/['"]+/g, ''));
				var collection = db.collection('products');
						
				collection.findOne({'_id': o_id}, function (err, item) {
					for( var i = 0; i < shoppingCart.length; i++){
						if ( String(shoppingCart[i]._id) === String(item._id)) {shoppingCart.splice(i, 1); break; }
					}
						
					db.collection('products').update(
						{ _id: o_id },
						{
							$set: {
								stock: item.stock+1
							}
						},
						{
							upsert: false,
							multi: true			
						}, function (err, res) {

					});
					
					collection.find().toArray(function(err, items) {
						if (err) {
							reject(err);
						} else {
							resolve(res.render('view.ejs', {almacen: items, carrito:shoppingCart}));
						}          
					});
				});
			});
		});
	});
	
};
