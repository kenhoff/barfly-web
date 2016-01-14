var app = require('express')();
port = process.env.PORT || 1175

app.get("/app.js", function (req, res) {
	res.sendFile(__dirname + "/app.js")
})


app.get("/style.css", function (req, res) {
	res.sendFile(__dirname + "/style.css")
})

app.get("*", function (req, res) {
	res.sendFile(__dirname + "/index.html")
})

app.listen(port, function () {
	console.log("Listening on", port);
})
