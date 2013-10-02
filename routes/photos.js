var Photo = require('../models/Photo');
var path = require('path');
var fs = require('fs');
var join = path.join;

exports.list = function(req, res, next) {
		Photo.find({}, function(err, photos) {
			if(err) return next(err);
			res.render('photos/index', {
				title: 'Photos',
				photos: photos
			});
		});
};

exports.form = function(req, res) {
		res.render('photos/upload', {
			title: 'Photo upload'
		});
};

exports.submit = function(dir) {
	
	return function(req, res, next) {
			var img = req.files.photo.image;
			var name = req.body.photo.name || img.name;
			var path = join(dir, img.name);
			fs.rename(img.path, path, function(err) {
				if(err) return next(err);
				Photo.create({
					name: name,
					path: img.name
				}, function(err) {
					if(err) return next(err);
					res.redirect('/');
				});
			});
	};
};

exports.download = function(dir) {
	return function(req, res, next) {
		var id = req.params.id;
		Photo.findById(id, function(err, photo) {
			if(err) return next(err);
			console.log('photo.path:' + photo.path);
			console.log('dir:' + dir);
			var path = join(dir, photo.path);
			console.log('path:' + path);
			//res.sendfile(path);
			res.download(path, photo.name + '.jpeg');
		});
	};
};

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}