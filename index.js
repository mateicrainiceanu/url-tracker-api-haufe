const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Url = require("./Url");
const Access = require("./Access");

const app = express();
const port = process.env.PORT || 3001;

const urls = [new Url("https://google.com", 1)];
const accesses = [];

app.use(bodyParser.json());
app.use(cors());

app.get("/userId", (req, res) => {
	res.status(200).json({id: Date.now()});
});

app.post("/tracker", (req, res) => {
	if (req.body.destination && req.body.userToken) {
		let newUrl = new Url(req.body.destination, req.body.userToken); //usertoken should be converted as id
		urls.push(newUrl);
		newUrl.save();

		res.status(201).send("Created");
	} else {
		res.status(400).send("Invalid");
	}
});

app.get("/short/:urlId", (req, res) => {
	const userAgent = req.get("user-agent");

	const newAccess = new Access(userAgent, req.params.urlId);
	accesses.push(newAccess);

	const toRedirect = urls.find((url) => url.urlId == req.params.urlId);

	if (toRedirect) {
		res.status(301).redirect(toRedirect.destination);
	} else {
		res.status(404).send("Not found");
	}
});

app.get("/urls", (req, res) => {
	if (req.query.userToken) {
		const found = urls.filter((url) => url.userId == req.query.userToken);
		res.status(200).json(found);
	} else {
		res.status(400).send("Invalid");
	}
});

app.get("/accesses", (req, res) => {
	if (req.query.urlId) {
		const found = accesses.filter((access) => access.urlId == req.query.urlId);
		res.status(200).json(found);
	} else {
		res.status(400).send("Invalid");
	}
});

app.listen(port, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log("server started on port " + port);
	}
});
