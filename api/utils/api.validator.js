// sanitize API input using joi
const Joi = require('joi');

// validate input for the required API
const shopifyValidate = ({ body }, res, next) => {
    const schema = Joi.object({
        url: Joi.string().required()
    });

    const { error } = schema.validate(body);

    if (error) {
        const { details: [{ message: errMsg }] } = error;
        const errPattern = /\"/gi;
        let message = errMsg.replaceAll(errPattern, '');
        message = `${message.charAt(0).toUpperCase()}${message.slice(1)}`;
        return res.status(400).send({ error: message });
    }

    return next();
};

module.exports = {
    shopifyValidate
}