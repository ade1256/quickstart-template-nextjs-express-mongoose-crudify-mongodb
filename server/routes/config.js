'use strict';

const mongooseCrudify = require('mongoose-crudify');

const Config = require('../models/config');

module.exports = function (server, router) {

	server.use(
		'/api/config',
		mongooseCrudify({
			Model: Config
		})
	);

};