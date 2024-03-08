const express = require('express');
const router = express.Router();
const shopifyRouter = require('./shopify.route')

router.use('/shopify', shopifyRouter);

module.exports = router;