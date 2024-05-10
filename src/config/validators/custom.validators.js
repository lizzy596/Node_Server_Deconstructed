const { pattern, string, refine, object, define} = require('superstruct');

const mongoRegex = /^[0-9a-fA-F]{24}$/;
const one = pattern(string(), mongoRegex);
const two = 'validMongoId'

const isValid = (value) => {
if(!mongoRegex.test(value)) return `Invalid MongoId`;
return true
};

const idStruct = 


const validMongoId = () => pattern(string(), mongoRegex);
// const custName = "objectIdValidator"


// const isValid = (value) => mongoRegex.test(value);


// const isGoodId = () => define('id', (value) => isValid(value));


// const validMongoId = () => pattern(string(), mongoId);

// const mongoValid = () => { refine(validMongoId, 'validMongo',(value) =>{
//   if(!value.test(mongoId)) {
//     return ("Invalid Mongo Id")
//   }
// })
// }

// const idValid = refine()



// const goodMongoId = ()  => { 
//   define('objectId', (value) => {
//   if(mongoId.test(value)) {
//     return []
//   } else {
//     return {
//       path: [],
//       message:`${context.path} must be a valid mongo id`,
//     }
//   }
// })}

module.exports = {validMongoId};



