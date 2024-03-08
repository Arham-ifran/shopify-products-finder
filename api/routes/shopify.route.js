const express = require('express');
const { shopifyValidate } = require('../utils/api.validator.js');
const { getPrices } = require('../controllers/shopify.controller.js');

const router = express.Router();

router.route('/t-shirt-prices').post(shopifyValidate, getPrices);

module.exports = router;