var app = require('express')();
port = process.env.PORT || 1175

app.get("/", function (req, res) {
	res.send(200)
})


app.listen(port, function () {
	console.log("Listening on", port);
})
