const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

module.exports = pick;

//pick takes an object (like the request object) and an array of keys returns a new object with just those object properties that correspond to the given
//list of keys
//for ex. :

//raw request object const sampleReq = {
//   method: 'GET',
//   url: '/api/users',
//   params: {
//     userId: '123'
//   },
//   query: {
//     page: '1',
//     limit: '10'
//   },
//   body: {
//     username: 'example_user',
//     email: 'user@example.com'
//   }
// };

//refined request object: {body: { username: 'example_user', email: 'user@example.com' },  query: { page: '1', limit: '10' }, params: { userId: '123' }}
