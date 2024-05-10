
const pick = require('../utils/pick');
const { validate, StructError } = require('superstruct');
const ClientError = require('../error/ClientError')



const generateValidationMessage = (err, delimiter) => {
  const delimiterIndex = err?.message?.indexOf(delimiter);
  if (delimiterIndex !== -1) {
    return err?.message?.substring(delimiterIndex + delimiter.length).trim()
  } else {
    return error?.type;
  }
}





const validateInput = (schema) => (req, res, next) => {
  const formattedPayload = pick(req, ['body', 'params', 'query']);
    const [error] = validate(formattedPayload, schema);
    console.log('EWREJWJDO', error); 
  
  if (error) {
    if (error instanceof StructError) {
      const errorMessage = generateValidationMessage(error, "--");
      const inputKey = error.key.charAt(0).toUpperCase() + error.key.slice(1);
      throw ClientError.BadRequest(`${errorMessage} at field ${inputKey}`)
    } else {
      next(error);
    }
  } 
   next()
}



module.exports = validateInput;