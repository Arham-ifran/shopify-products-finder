const axios = require('axios');
const cheerio = require('cheerio');
const { getShopifyStoreUrl, getShopifyStoreProductsUrl, tshirtKeywords } = require('../../config/config.js');

// API definition to get the prices
const getPrices = async (req, res) => {
    try {
        const { url } = req.body;
        const { statusCode, ...result } = await getTshirtPrices(url);
        return res.status(statusCode).send(result);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

// method to get t-shirt prices from the given store
const getTshirtPrices = async (url) => {
    try {
        const shopifyStoreProductsUrl = getShopifyStoreProductsUrl(url);
        const { data } = await axios.get(shopifyStoreProductsUrl);
        const products = await findTshirts(data?.products);

        if (!products?.length)
            return {
                statusCode: 404,
                error: 'No t-shirts found in the store.'
            };

        const prices = products.map(product => parseFloat(product.variants[0].price));
        const minPrice = Math.min(...prices).toFixed(2);
        const maxPrice = Math.max(...prices).toFixed(2);
        const { currency } = await getCurrency(url);

        return {
            statusCode: 200,
            url,
            minimum_tshirt_price: minPrice,
            maximum_tshirt_price: maxPrice,
            currency
        };
    } catch (error) {
        return {
            statusCode: 502,
            error: 'Failed to fetch t-shirt prices, along with the currency.'
        };
    }
};

const getCurrency = async (url = '') => {
    try {
        // appending https in the url
        const shopifyStoreUrl = getShopifyStoreUrl(url);

        // fetch HTML content of the store's homepage
        const { data: html } = await axios.get(shopifyStoreUrl);

        // load HTML content into Cheerio for parsing
        const $ = cheerio.load(html);

        // extract currency symbol from meta tags or other elements where it might be present
        const currency = $('[data-currency]').attr("data-currency") ||
            $('meta[property="og:price:currency"]').attr('content') ||
            $('meta[itemprop="priceCurrency"]').attr('content') || '';

        return {
            currency
        };
    } catch (error) {
        return {
            statusCode: 400,
            error: 'Error while getting currency.'
        };
    }
};

// method to check if the store has the t-shirts either with tag or product type
const findTshirts = (products = []) => {
    const result = products.filter((product) => {
        // destructuring required data from the product
        const { product_type: productType = '', tags = [] } = product;

        const lowerCaseProductType = productType.toLowerCase();
        const lowerCaseTags = tags.map(tag => tag.toLowerCase());

        // checks if product type matches any of the keywords
        const matchesProductType = tshirtKeywords.some(keyword => lowerCaseProductType.includes(keyword));

        // checks if any of the tags match any of the keywords
        const matchesTags = lowerCaseTags.some(tag => tshirtKeywords.includes(tag));

        // returns true if either product type or tags match
        return matchesProductType || matchesTags;
    });

    return result;
};

module.exports = {
    getPrices,
    getTshirtPrices,
    getCurrency,
    findTshirts
}