const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': `"email" should be a type of 'text'`,
    'string.email': `"email" must be a valid email`,
    'any.required': `"email" is a required field`
  }),
  password: Joi.string().min(6).required().messages({
    'string.base': `"password" should be a type of 'text'`,
    'string.min': `"password" should have a minimum length of 6`,
    'any.required': `"password" is a required field`
  }),
  fmcToken: Joi.string().optional()
});

module.exports = {
  loginSchema
};