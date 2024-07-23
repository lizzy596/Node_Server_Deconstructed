import { Request, Response, NextFunction } from 'express';
import pick from '../utils/pick.util.js';
const{ validate, StructError } = require('superstruct');
import ClientError from '../error/ClientError.js';

// This function formats the error message sent to the user in a readable way
const generateValidationMessage = (errorMessage: string, problemField:string): string => {
  const delimiter = errorMessage.includes("Expected a value")
    ? "Expected a value"
    : "--";
  const inputField = problemField.charAt(0).toUpperCase() + problemField.slice(1);
  const delimiterIndex = errorMessage?.indexOf(delimiter);
  if (delimiterIndex !== -1) {
    const errMsg = errorMessage
      ?.substring(delimiterIndex + delimiter.length)
      .trim();
    return `The field ${inputField} must be ${errMsg}`;
  } else {
    return errorMessage.trim() ?? 'Unknown error occurred';
  }
};

// This validates the request object against the schema
const validateInput = (schema : Record<string,any>) => (req: Request, _res: Response, next: NextFunction) => {
  const schemaKeys = Object.keys(schema.schema);
  const formattedPayload = pick(req, schemaKeys);
  const [error] = validate(formattedPayload, schema);
  if (error) {
    if (error instanceof StructError) {
      next(ClientError.BadRequest(generateValidationMessage(error?.message, error?.key)));
    } else {
      next(error);
    }
  }
  next();
};

export default validateInput;



// import { Request, Response, NextFunction } from 'express';
// import pick from '../utils/pick.js';
// const{ validate, StructError } = require('superstruct');
// import ClientError from '../error/ClientError.js';

// // This function formats the error message sent to the user in a readable way
// const generateValidationMessage = (err: StructError): string => {
//   const delimiter = err?.message.includes("Expected a value")
//     ? "Expected a value"
//     : "--";
//   const inputField = err.key.charAt(0).toUpperCase() + err?.key.slice(1);
//   const delimiterIndex = err?.message?.indexOf(delimiter);
//   if (delimiterIndex !== -1) {
//     const errMsg = err?.message
//       ?.substring(delimiterIndex + delimiter.length)
//       .trim();
//     return `The field ${inputField} must be ${errMsg}`;
//   } else {
//     return err?.message?.trim() ?? 'Unknown error occurred';
//   }
// };

// // This validates the request object against the schema
// const validateInput = (schema: Struct) => (req: Request, _res: Response, next: NextFunction) => {
//   const schemaKeys = Object.keys(schema.schema);
//   const formattedPayload = pick(req, schemaKeys);
//   const [error] = validate(formattedPayload, schema);
//   if (error) {
//     if (error instanceof StructError) {
//       console.log(error);
//       next(ClientError.BadRequest(generateValidationMessage(error)));
//     } else {
//       next(error);
//     }
//   }
//   next();
// };

// export default validateInput;

