
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var photos = require('./routes/photos');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var MongoStore = require('connect-mongo')(express);
var flash = require('connect-flash');
var User = require('./models/User')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('photos', __dirname + '/public/photos');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({
	secret: 'jacklin secret',
	store: new MongoStore({
		db:'photo_app',
	}),
	cookie:{maxAge: 60000},
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


var exampleUser = new User({username:'jacklin', password:'1011'});
exampleUser.save();

passport.use(new LocalStrategy({
	usernameField: 'username',
	passwordField: 'password',
  },
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
	  
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));


passport.serializeUser(function(user, done) {
    return done(null, user.id); //this is the 'user' property saved in req.session.passport.user
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function(err, user) {
	    done(err, user);
	 });
});


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/login', user.login);
app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/photos',
    failureRedirect: '/login',
    failureFlash: true
  })
);


app.get('/logout', ensureAuthenticated, function(req, res) {
		req.logout();
		res.redirect('/login');
		
});
app.get('/photos', ensureAuthenticated, photos.list);
app.get('/upload', ensureAuthenticated, photos.form);
app.post('/upload', ensureAuthenticated, photos.submit(app.get('photos')));
app.get('/photo/:id/download',ensureAuthenticated, photos.download(app.get('photos')));


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

console.log("welcome to express world zhang wen jin!");
