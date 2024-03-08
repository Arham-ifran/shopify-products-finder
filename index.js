const serverless = require("serverless-http");
const express = require('express');
const router = require('./api/routes/index');

const app = express();

app.use(express.json());

app.use('/v1/', router);

module.exports.handler = serverless(app);