module.exports = function(app) {
    app.get('/parser/fetchResponse', function(req, res) {
        res.end('Perfect Loading of plugins...');
    });
};