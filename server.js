var app = require('express')();


port = process.env.PORT || 1001
app.listen(port, function (req, res) {
	res.send(200)
})
