
const pick = require('../utils/pick');
const {validate, StructError} = require('superstruct');
const ClientError = require('../error/ClientError')



const validateRequest = (schema) => (req, res, next) => {


      const [error, value] = validate(req.body, schema)
      if(error) {
        if(error instanceof StructError) {
          const inputKey = error.key.charAt(0).toUpperCase() + error.key.slice(1);
          throw ClientError.BadRequest(`${inputKey} must be a ${error.type}`)
         } else {
          next(error);
        }

      } else {
        next()
      }

     


 


}



module.exports = validateRequest;