const parseNumber = (str:string) => {
  const match = str.match(/(\d+)/);
  if (match) {
    return parseFloat(match[0]);
  } else {
    return null; 
  }
}

export default parseNumber