const pick = (obj, keys) => {

  let formatted = {};
  keys.forEach((key) => {
    if(JSON.stringify(obj[key]) !== '{}') {
      formatted = obj[key];
    }
  })
  return formatted;
}


module.exports = pick;