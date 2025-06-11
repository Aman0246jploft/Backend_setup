const Joi = require('joi');

const moduleSchemaForId = Joi.object({
  id: Joi.string().required(),

});



module.exports = {
  moduleSchemaForId
};