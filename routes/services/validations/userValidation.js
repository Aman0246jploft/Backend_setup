const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required().messages({
    'string.base': `"password" should be a type of 'text'`,
    'string.min': `"password" should have a minimum length of 6`,
    'any.required': `"password" is a required field`
  })
});

const registerSchema = Joi.object({
  userName: Joi.string().min(2).optional(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required().messages({
    'string.base': `"password" should be a type of 'text'`,
    'string.min': `"password" should have a minimum length of 6`,
    'any.required': `"password" is a required field`
  })
});

module.exports = {
  loginSchema,
  registerSchema
};