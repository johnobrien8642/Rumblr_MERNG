const Validator = require('validator');
const validText = require('./valid_text');


module.exports = function validateLoginInput(data) {
  
  data.username = validText(data.username) ? data.username : '';
  data.password = validText(data.password) ? data.password : '';

  if (Validator.isEmpty(data.username)) {
    return { message: 'Username cannot be empty', isValid: false }
  }

  if (Validator.isEmpty(data.password)) {
    return { message: 'Password cannot be empty', isValid: false }
  }

  return {
    message: '',
    isValid: true
  }
}