var nullCallback = function() {};

var JSONResponse = function(httpResponseObj, responseArr) {
	httpResponseObj.setHeader('Content-type', 'application/json');
	httpResponseObj.send(JSON.stringify(responseArr));
};
exports.JSONResponse = JSONResponse;


exports.sanetizeTitle = function(str) {
	return str.toLowerCase().trim().replace(new RegExp('[^a-zA-Z0-9]', 'g'), '-');
};