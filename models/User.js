var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	username: String,
	password: String
});

schema.methods.validPassword = function (password) {
if (password === this.password) {
    return true;
} else {
    return false;
}
}

module.exports = mongoose.model('User', schema);