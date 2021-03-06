require('dotenv').config()
const express = require('express')
const server = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const glob = require('glob')

const next = require('next')
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/rajawalicinema'
console.log(process.env.MONGODB_URI)
app.prepare().then(() => {

	// Parse application/x-www-form-urlencoded
	server.use(bodyParser.urlencoded({ extended: false }));
	// Parse application/json
	server.use(bodyParser.json());

	// Allows for cross origin domain request:
	server.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	});

	// MongoDB
	mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));

	// API routes
	const rootPath = require('path').normalize(__dirname + '/..');
	glob.sync(rootPath + '/server/routes/*.js').forEach(controllerPath => require(controllerPath)(server));

	// Next.js route
	server.get('*', (req, res) => {
		return handle(req, res)
	})

	server.listen(process.env.PORT || 3333, function () {
		console.log(`App telah up dan running di http://localhost:${process.env.PORT || 3333}/`)
	});

})
