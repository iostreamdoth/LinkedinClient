/*
 * GET users listing.
 */
var request = require("request");
var url = require('url');

exports.list = function(req, res) {
	res.send("respond with a resource");
};
exports.signin = function(req, res) {
	var username = req.param("username");
	var password = req.param("password");
	request({
		uri : "http://localhost:3009/user/signinver",
		method : "POST",
		form : {
			firstname : "",
			lastname : "",
			username : req.param("username"),
			password : req.param("password")
		}
	}, function(error, response, body) {
		var l = JSON.parse(body);
		console.log(l.status);
		if (l.status == "success") {
			console.log(l.data);
			req.session.uid = l.data;
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify({
				status : "success"
			}));
		} else {
			res.send({
				status : "failure"
			})
		}
	});

}
exports.signup = function(req, res) {
	// console.log(req);
	var firstname = req.param("firstname");
	var lastname = req.param("lastname");
	var username = req.param("username");
	var password = req.param("password");
	console.log(firstname);
	console.log(lastname);
	console.log(username);
	console.log(password);

	request({
		uri : "http://localhost:3009/signup",
		method : "POST",
		form : {
			firstname : req.param("firstname"),
			lastname : req.param("lastname"),
			username : req.param("username"),
			password : req.param("password")
		}
	}, function(error, response, body) {
		console.log(body);
		res.send({
			login : "success"
		})
	});

};

exports.profile = function(req, res) {
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;

	request({
		uri : "http://localhost:3009/profile/get",
		method : "POST",
		form : {
			userid : query.uid,
			profileid : 0,
			organisation : "",
			type : "",
			desc : "",
			as : "",
			from : "",
			to : "",
			location : "",
			summary : ""
		}
	}, function(error, response, body) {
		var l = JSON.parse(body);
		var w = [];
		var e = []
		console.log(l.status);
		if (l.status == "success") {
			console.log(l.data);
			var data = JSON.parse(l.data);
			for (var i = 0; i < data.length; i++) {
				if (data[i].type == "ED") {
					e.push(data[i]);
					console.log(data[i]);
				} else {
					console.log(data[i]);
					w.push(data[i]);
				}
			}

			request({
				uri : "http://localhost:3009/user/getuserdetails",
				method : "POST",
				form : {
					userid : query.uid,
					firstname : "",
					lastname : "",
					username : "",
					password : "",
					imagedetail : "",
					invitation : 0,
					totalconnection : 0,
					summary : ""
				}
			}, function(err, rponse, bdy) {

				var p = JSON.parse(bdy);
				p = JSON.parse(p.data);

				request({
					uri : "http://localhost:3009/skill/getskills",
					method : "POST",
					form : {
						userid : query.uid,
					}
				}, function(er, rpons, bd) {

					var h = JSON.parse(bd);
					h = JSON.parse(h.data);
					console.log(JSON.stringify(h));
					res.render('profile', {
						session : req.session.uid,
						work : w,
						education : e,
						profile : p[0],
						skill : h

					});

				});

			});

			;
		} else {
			res.send({
				status : "failure"
			})
		}
	});

}
exports.editprofile = function(req, res) {

	if (req.session.uid == undefined) {

		res.redirect("/");

	}
	var uid = req.session.uid;
	request({
		uri : "http://localhost:3009/profile/get",
		method : "POST",
		form : {
			userid : uid,
			profileid : 0,
			organisation : "",
			type : "",
			desc : "",
			as : "",
			from : "",
			to : "",
			location : "",
			summary : ""
		}
	}, function(error, response, body) {
		var l = JSON.parse(body);
		var w = [];
		var e = []
		console.log(l.status);
		if (l.status == "success") {
			console.log(l.data);
			var data = JSON.parse(l.data);
			for (var i = 0; i < data.length; i++) {
				if (data[i].type == "ED") {
					e.push(data[i]);
					console.log(data[i]);
				} else if (data[i].type == "WO") {
					console.log(data[i]);
					w.push(data[i]);
				}
			}

			request({
				uri : "http://localhost:3009/user/getuserdetails",
				method : "POST",
				form : {
					userid : uid,
					firstname : "",
					lastname : "",
					username : "",
					password : "",
					imagedetail : "",
					invitation : 0,
					totalconnection : 0,
					summary : ""
				}
			}, function(err, rponse, bdy) {

				var p = JSON.parse(bdy);
				p = JSON.parse(p.data);

				request({
					uri : "http://localhost:3009/skill/getskills",
					method : "POST",
					form : {
						userid : uid,
					}
				}, function(er, rpons, bd) {

					var h = JSON.parse(bd);
					h = JSON.parse(h.data);
					console.log(JSON.stringify(h));
					res.render('editprofile', {
						session : req.session.uid,
						work : w,
						education : e,
						profile : p[0],
						skill : h

					});

				});
			});

			;
		} else {
			res.send({
				status : "failure"
			})
		}
	});

}

exports.editsummary = function(req, res) {
	console.log(req.param("summary"))
	if (req.session.uid == undefined) {

		res.redirect("/");

	}
	var uid = req.session.uid;
	var p_summary = req.param("summary");
	request({
		uri : "http://localhost:3009/profile/updatesummary",
		method : "POST",
		form : {
			userid : uid,
			firstname : "",
			lastname : "",
			username : "",
			password : "",
			imagedetail : "",
			invitation : 0,
			totalconnection : 0,
			summary : p_summary
		}
	}, function(err, rponse, bdy) {

		var p = JSON.parse(bdy);
		p = JSON.parse(p.data);
		res.send({
			status : "success"

		});

	});
}
exports.editexp = function(req, res) {
	if (req.session.uid == undefined) {

		res.redirect("/");

	}
	var uid = req.session.uid;
	var p_profileid = req.param("profileid");
	request({
		uri : "http://localhost:3009/profile/getbyid",
		method : "POST",
		form : {
			userid : uid,
			profileid : p_profileid,
			organisation : "",
			type : "",
			desc : "",
			as : "",
			from : "",
			to : "",
			location : "",
			summary : ""
		}
	}, function(err, rponse, bdy) {

		var p = JSON.parse(bdy);
		p = JSON.parse(p.data);
		console.log(JSON.stringify(p));
		res.send({
			status : "success",
			data : p[0]
		});

	});
}

exports.addexp = function(req, res) {
	if (req.session.uid == undefined) {

		res.redirect("/");

	}
	var uid = req.session.uid;
	var p_profileid = req.param("profileid");
	request({
		uri : "http://localhost:3009/profile/create",
		method : "POST",
		form : {
			userid : uid,
			profileid : 0,
			organisation : req.param("organisation"),
			type : req.param("type"),
			desc : req.param("desc"),
			as : req.param("as"),
			from : req.param("from"),
			to : req.param("to"),
			location : req.param("location"),
			summary : req.param("summary")
		}
	}, function(err, rponse, bdy) {

		var p = JSON.parse(bdy);
		p = JSON.parse(p.data);
		console.log(JSON.stringify(p));
		res.send({
			status : "success",
			data : p[0]
		});

	});
}

exports.editexpid = function(req, res) {
	if (req.session.uid == undefined) {

		res.redirect("/");

	}
	var uid = req.session.uid;
	console.log("1");
	var p_profileid = req.param("profileid");
	console.log("2");
	request({
		uri : "http://localhost:3009/profile/update",
		method : "POST",
		form : {
			userid : uid,
			profileid : p_profileid,
			organisation : req.param("organisation"),
			type : req.param("type"),
			desc : req.param("desc"),
			as : req.param("as"),
			from : req.param("from"),
			to : req.param("to"),
			location : req.param("location"),
			summary : req.param("summary")
		}
	}, function(err, rponse, bdy) {
		console.log("3");
		var p = JSON.parse(bdy);
		p = JSON.parse(p.data);
		console.log("Real Data")
		console.log(JSON.stringify(p));
		res.send({
			status : "success",
			data : p[0]
		});

	});
}
exports.delexp = function(req, res) {
	if (req.session.uid == undefined) {

		res.redirect("/");

	}
	var uid = req.session.uid;
	console.log("1");
	var p_profileid = req.param("profileid");
	console.log("2");
	request({
		uri : "http://localhost:3009/profile/delexp",
		method : "POST",
		form : {
			userid : uid,
			profileid : p_profileid,
			organisation : "",
			type : "",
			desc : "",
			as : "",
			from : "",
			to : "",
			location : "",
			summary : ""
		}
	}, function(err, rponse, bdy) {
		console.log("3");

		console.log("Real Data")
		console.log(JSON.stringify(bdy));
		res.send({
			status : "success",

		});

	});
}

exports.search = function(req, res) {
	var name = req.param("name");
	console.log(name);
	var uid = 0;
	if (req.session.uid != undefined) {
		uid = req.session.uid;
	}

	var namearr = name.split(" ");
	var uname1 = "";
	var uname2 = "";
	var uname3 = "";
	for (var i = 0; i < namearr.length; i++) {
		if (i == 0)
			uname1 = namearr[i];
		if (i == 1)
			uname2 = namearr[i];
		if (i == 2)
			uname3 = namearr[i];
	}
	if (uname2 == "")
		uname2 = uname1;
	if (uname3 == "")
		uname3 = uname1;

	console.log(uname1);
	console.log(uname2);
	console.log(uname3);

	request({
		uri : "http://localhost:3009/profile/search",
		method : "POST",
		form : {
			uname1 : uname1,
			uname2 : uname2,
			uname3 : uname3,
			userid : uid
		}
	}, function(err, rponse, bdy) {
		console.log("3");
		var p = JSON.parse(bdy);
		console.log("Real Data")
		console.log(JSON.stringify(p.data));
		res.render('search', {
			result : JSON.parse(p.data)

		});

	});
}
exports.getall = function(req, res) {
	var uname1 = "";
	var uname2 = "";
	var uname3 = "";
	var uid = 0;
	if (req.session.uid != undefined) {
		uid = req.session.uid;
	}
	request({
		uri : "http://localhost:3009/profile/search",
		method : "POST",
		form : {
			uname1 : uname1,
			uname2 : uname2,
			uname3 : uname3,
			userid : uid
		}
	}, function(err, rponse, bdy) {
		console.log("3");
		var p = JSON.parse(bdy);
		console.log("Real Data")
		console.log(JSON.stringify(p.data));
		res.render('search', {
			result : JSON.parse(p.data)

		});

	});
}

exports.getallconnections = function(req, res) {
	if (req.session.uid == undefined) {

		res.redirect("/");

	}
	var uid = req.session.uid;
	var uname1 = "";
	var uname2 = "";
	var uname3 = "";
	request({
		uri : "http://localhost:3009/connection/getconnectionsdetails",
		method : "POST",
		form : {
			idconnections : 0,
			userid : uid,
			touserid : 0
		}
	}, function(err, rponse, bdy) {
		console.log("3");
		var p = JSON.parse(bdy);
		console.log("Real Data")
		console.log(JSON.stringify(p.data));
		res.render('connection', {
			result : JSON.parse(p.data)

		});

	});
}
exports.sendinvitations = function(req, res) {
	if (req.session.uid == undefined) {

		res.redirect("/");

	}

	var touserid = req.param("touserid");
	var fromuserid = req.session.uid;
	var connectiontype = req.param("connectiontype");
	var message = req.param("message");
	request({
		uri : "http://localhost:3009/invite/sendinvitation",
		method : "POST",
		form : {
			idinvitations : 0,
			touserid : touserid,
			fromuserid : fromuserid,
			connectiontype : 'FR',
			message : message

		}
	}, function(err, rponse, bdy) {
		console.log("3");
		var p = JSON.parse(bdy);
		console.log("Real Data")
		console.log(JSON.stringify(p.data));
		res.send({
			status : "success",
		});

	});

}

exports.getinvitationstatus = function(req, res) {
	if (req.session.uid == undefined) {

		res.redirect("/");

	}
	var uid = req.session.uid;
	request({
		uri : "http://localhost:3009/user/getuserdetails",
		method : "POST",
		form : {
			userid : uid,
			firstname : "",
			lastname : "",
			username : "",
			password : "",
			imagedetail : "",
			invitation : 0,
			totalconnection : 0,
			summary : ""
		}
	}, function(er, rpons, bd) {

		var h = JSON.parse(bd);
		h = JSON.parse(h.data);
		console.log(JSON.stringify(h));

		res.send({
			invitation : h[0].invitation
		});
	});

}
exports.box = function(req, res) {
	if (req.session.uid == undefined) {

		res.redirect("/");

	}
	var uid = req.session.uid;
	request({
		uri : "http://localhost:3009/invite/box",
		method : "POST",
		form : {
			idinvitations : 0,
			touserid : uid,
			fromuserid : 0,
			connectiontype : 'FR',
			message : ''
		}
	}, function(er, rpons, bd) {

		var h = JSON.parse(bd);
		console.log("stringify here");
		console.log(JSON.stringify(h));
		console.log(h)
		if (h.data.length == 0) {
			res.render('invitations', {
				result : {
					status : "No Data"
				},
				status : "nodata"

			});

		} else {
			console.log("redering0");
			res.render('invitations', {
				result : h.data,
				status : "success"
			});
		}
	});

}
exports.signout = function(req, res) {
	req.session = null;
	res.render('signout', {});
}

exports.acceptinvitation = function(req, res) {
	if (req.session.uid == undefined) {

		res.redirect("/");

	}
	var uid = req.session.uid;

	var uri = "";
	if (req.param("decision") == "A") {
		uri = "http://localhost:3009/invite/accept";
	} else if (req.param("decision") == "R") {
		uri = "http://localhost:3009/invite/reject";
	} else {
		res.redirect("/illegalopration");
	}

	request({
		uri : uri,
		method : "POST",
		form : {
			idinvitations : req.param("idinvitations"),
			touserid : uid,
			fromuserid : req.param("fromid"),
			connectiontype : 'FR',
			message : ''
		}
	}, function(er, rpons, bd) {

		var h = JSON.parse(bd);
		console.log("stringify here");
		console.log(JSON.stringify(h));
		console.log(h)

		res.render('invitations', {
			result : h,
			status : "success"

		});
	});
}


exports.addskill = function(req, res) {
	if (req.session.uid == undefined) {

		res.redirect("/");

	}
	var uid = req.session.uid;

	var uri = "";
	
		uri = "http://localhost:3009/skill/setskills";
	

	request({
		uri : uri,
		method : "POST",
		form : {
			userid : req.session.uid,
			skillname : req.param("skillname")
			
		}
	}, function(er, rpons, bd) {

		var h = JSON.parse(bd);
		console.log("stringify here");
		console.log(JSON.stringify(h));
		console.log(h)

		res.render('invitations', {
			result : h,
			status : "success"

		});
	});
}
exports.delskill = function(req, res) {
	if (req.session.uid == undefined) {

		res.redirect("/");

	}
	var uid = req.session.uid;

	var uri = "";
	
		uri = "http://localhost:3009/skill/removeskills";
	request({
		uri : uri,
		method : "POST",
		form : {
			userid : req.session.uid,
			skillid : req.param("skillid")
			
		}
	}, function(er, rpons, bd) {

		var h = JSON.parse(bd);
		console.log("stringify here");
		console.log(JSON.stringify(h));
		console.log(h)

		res.render('invitations', {
			result : h,
			status : "success"

		});
	});
}



exports.failure = function(req, res) {
	res.render('failure', {});
}
