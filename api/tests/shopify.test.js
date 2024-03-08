const { getTshirtPrices, getCurrency, findTshirts } = require('../controllers/shopify.controller');

describe('getTshirtPrices', () => {
    test('should return minimum and maximum t-shirt prices along with currency', async () => {
        const result = await getTshirtPrices('bohme.com');
        expect(result.statusCode).toBe(200);
        expect(result.minimum_tshirt_price).toBe('24.50');
        expect(result.maximum_tshirt_price).toBe('52.50');
        expect(result.currency).toBe('USD');
    });

    test('should return an error if no t-shirts, tops, or tees are found', async () => {
        const result = await getTshirtPrices('jeffreestarcosmetics.com');
        expect(result.statusCode).toBe(404);
        expect(result.error).toBe('No t-shirts found in the store.');
    });

    test('should return an error if the products.json is not accessible for the given url', async () => {
        const result = await getTshirtPrices('stitchfix.com');
        expect(result.statusCode).toBe(502);
        expect(result.error).toBe('Failed to fetch t-shirt prices, along with the currency.');
    });
});

describe('getCurrency', () => {
    test('should return currency symbol', async () => {
        const result = await getCurrency('bohme.com');
        expect(result.currency).toBeTruthy();
    });

    test('should return an error if currency retrieval fails', async () => {
        const result = await getCurrency('google.com');
        expect(result.currency).toBe('');
    });
});

describe('findTshirts', () => {
    test('should filter t-shirts, tops, or tees from products product type', () => {
        const products = [
            { product_type: 't-shirt', tags: ['tee', 'tshirt', 't-shirt'] },
            { product_type: 'denim', tags: ['denim'] }
        ];
        const result = findTshirts(products);
        expect(result.length).toBe(1);
        expect(result[0].product_type).toBe('t-shirt');
    });

    test('should filter t-shirts, tops, or tees from products tags', () => {
        const products = [
            { product_type: 't-shirt', tags: ['tee', 'tshirt', 't-shirt'] },
            { product_type: 'denim', tags: ['denim'] }
        ];
        const result = findTshirts(products);
        expect(result.length).toBe(1);
        expect(result[0].tags.includes('t-shirt')).toBeTruthy();
    });

    test('should return an empty array if no t-shirts, tops, or tees are found', () => {
        const products = [
            { product_type: 'denim', tags: ['denim'] }
        ];
        const result = findTshirts(products);
        expect(result.length).toBe(0);
    });
});
