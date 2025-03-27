const Joi = require('joi');
const schema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Company name is required',
    'string.empty': 'Company name cannot be empty',
  }),
  shortName: Joi.string().required().messages({
    'any.required': 'Short name is required',
    'string.empty': 'Short name cannot be empty',
  }),
});

module.exports = schema;
