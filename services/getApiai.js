var apiai = require('apiai');
 
var app = apiai("4b4cab953b1e476cb883c8f5494bca64");

function getApiai(quetion, callback){
    var request = app.textRequest(quetion, {
        sessionId: '123'
    });
    
    request.on('response', function(response) {
        callback(response.result.fulfillment.speech);        
    });
    
    request.on('error', function(error) {
        callback("허거덕...");
    });    

    request.end();
}

module.exports = getApiai;