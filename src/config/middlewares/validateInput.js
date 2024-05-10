const pick = require('../utils/pick');
const { validate, StructError } = require('superstruct');
const ClientError = require('../error/ClientError')

//This function formats the error message sent to the user and a readable way

const generateValidationMessage = (err) => {
  const delimiter = err?.message.includes("Expected a value") ? "Expected a value" : "--";
  const inputField = err.key.charAt(0).toUpperCase() + err?.key.slice(1);
  const delimiterIndex = err?.message?.indexOf(delimiter);
  if (delimiterIndex !== -1) {
    const errMsg = err?.message?.substring(delimiterIndex + delimiter.length).trim()
    return `The field ${inputField} must be ${errMsg}`
  } else {

    return err?.message?.trim();
  }
}

//This validates the request object against the schema

const validateInput = (schema) => (req, res, next) => {
  const schemaKeys = Object.keys(schema.schema);
  const formattedPayload = pick(req, schemaKeys);
   const [error] = validate(formattedPayload, schema);
  if (error) {
    if (error instanceof StructError) {
      console.log(error)
      
      next(ClientError.BadRequest(generateValidationMessage(error)));
    } else {
      next(error);
    }
  } 
   next()
}


module.exports = validateInput;