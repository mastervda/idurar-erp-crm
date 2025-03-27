const Joi = require('joi');

const schema = Joi.object({
  name: Joi.string().required(),
  company: Joi.string().required(),
  tags: Joi.array().items(Joi.string()),
  phone: Joi.string(),
  country: Joi.string(),
  address: Joi.string(),
  email: Joi.string().email(),
  createdBy: Joi.string(),
  assigned: Joi.string(),
});

module.exports = schema;
