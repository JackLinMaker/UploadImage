var vows = require('vows');
var assert = require('assert');
var tobi = require('tobi');
var request = require('request');
var app = require('../app');
var http = require('http');

var BASE_URL = 'http://localhost:3000';
var browser = tobi.createBrowser(3000, 'localhost');

/*vows.describe('routes').addBatch({
	'GET /': respondsWith(200),
	'GET /upload': respondsWith(200)
}).export(module);*/

/*browser.get('/', function(res, $) {
	//res.should.have.status(200);
	$('h1').should.have.text('Photos');
	$('title').should.have.text('Photos');
});*/

browser.get('/upload', function(res, $) {
	$('form')
		.fill({
			'photo[name]':'test',
			'photo[image]':'/Users/jacklin/Pictures/me.jpg'
		}).submit(function(res, $) {
			console.log(res.statusCode);
			//res.should.have.status(200);
			//$('title').should.have.text('Photos');
			//$('h2').should.not.equal(0);
		});
});



function respondsWith(status) {
    var context = {
        topic: function () {
            // Get the current context's name, such as "POST /"
            // and split it at the space.
            var req    = this.context.name.split(/ +/), // ["POST", "/"]
                method = req[0].toLowerCase(),          // "post"
                path   = req[1];                        // "/"

            // Perform the contextual client request,
            // with the above method and path.
            //client[method](path, this.callback);
			request({
				uri: BASE_URL + path,
				method: method
			},this.callback);
			
        }
    };
    // Create and assign the vow to the context.
    // The description is generated from the expected status code
    // and status name, from node's http module.
	
    context['should respond with a ' + status + ' '
           + http.STATUS_CODES[status]] = assertStatus(status);
		   
    return context;
}

function assertStatus(code) {
    return function (e, res) {
        assert.equal (res.statusCode, code);
    };
}