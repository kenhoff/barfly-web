var app = require('express')();
var harp = require('harp');
port = process.env.PORT || 1175

app.use(harp.mount(__dirname))

app.listen(port, function () {
	console.log("Listening on", port);
})
