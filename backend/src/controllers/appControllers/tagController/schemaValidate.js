const Joi = require('joi');

const schema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Tag name is required',
    'string.empty': 'Tag name cannot be empty',
  }),
  // Tambahkan field lain jika diperlukan
});

module.exports = schema;
