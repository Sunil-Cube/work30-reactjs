
require('dotenv').config();

module.exports = {
    'jwtTokenVerificationEnable': true, // true/false
    'secret': process.env.JWT_TOKEN_SECRET, // jwt secret key
 
}
