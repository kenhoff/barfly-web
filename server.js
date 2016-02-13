express = require('express')
var app = express();
port = process.env.PORT || 1175

app.use(express.static(__dirname + '/static'))

app.get("*", function (req, res) {
	res.sendFile(__dirname + "/static/index.html")
})

app.listen(port, function () {
	console.log("Listening on", port);
})
