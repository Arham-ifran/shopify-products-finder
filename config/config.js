const getShopifyStoreUrl = (url = '') => `https://${url}`;

const getShopifyStoreProductsUrl = (url = '') => `https://${url}/products.json`;

// keywords for t-shirt type products
const tshirtKeywords = [
    'tshirt',
    'tshirts',
    't-shirt',
    't-shirts',
    'top',
    'tops',
    'tee',
    'tees'
];

module.exports = {
    getShopifyStoreUrl,
    getShopifyStoreProductsUrl,
    tshirtKeywords
}