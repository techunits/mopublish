module.exports = function(app) {
    app.get('/mptest', function(httpRequest, httpResponse) {
        httpResponse.end('Welcome to Mopublish test plugin page....');
    });
    
    
    app.get('/mptest/dev', function(httpRequest, httpResponse) {
        httpResponse.end('Plugin Development');
    });
};