const { z } = require('zod')



const validate = (schema) => (req, res, next) => {
  schema.parse(req.body)
};




module.exports = validate;