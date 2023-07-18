const Joi = require('joi')

exports.AlbumPayloadValidationSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
})
