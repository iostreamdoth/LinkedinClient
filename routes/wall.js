var request = require("request");
var ejs = require("ejs");

exports.view = function(req, res) {
	console.log("sessionid " + req.session.uid);
	if (req.session.uid == undefined) {

		res.redirect("/");

	} else {
		res.render('wall', {
			session : req.session.uid,
		});
	}
};
exports.getwall = function(req, res) {
	var puserid = req.session.uid;

	console.log(puserid);
	if (puserid == undefined) {

		res.redirect("/");

	} else {

		request({
			uri : "http://localhost:3009/connection/connectionfeed",
			method : "POST",
			form : {
				idconnections : 0,
				userid : puserid,
				touserid : puserid,
			}
		}, function(error, response, body) {
			var l = JSON.parse(body);
			console.log(l.status);
			if (l.status == "success") {
				console.log(l.data);

				res.setHeader('Content-Type', 'application/json');
				res.send({
					session : req.session.uid,
					feed : l.data
				});

				;
			} else {
				res.send({
					status : "failure"
				})
			}
		});
	}
}
