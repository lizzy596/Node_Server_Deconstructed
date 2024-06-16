export const setCookieExpiration = (jwt:string) => {
const parts = jwt.split('.');
if (parts.length !== 3) {
    throw new Error('Invalid JWT format');
}
if(parts[1]) {
const payload = JSON.parse(atob(parts[1].replace(/_/g, '/').replace(/-/g, '+')));
const exp = payload.exp;
return exp;
} else {
  return
}
}