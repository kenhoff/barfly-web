var app = require('express')();
var harp = require('harp');
port = process.env.PORT || 1175

app.get("/bundle.js", function (req, res) {
	res.sendFile(__dirname + "/bundle.js")
})


app.get("/style.css", function (req, res) {
	res.sendFile(__dirname + "/style.css")
})

app.get("*", function (req, res) {
	res.sendFile(__dirname + "/index.html")
})

app.use(harp.mount(__dirname))

app.listen(port, function () {
	console.log("Listening on", port);
})
