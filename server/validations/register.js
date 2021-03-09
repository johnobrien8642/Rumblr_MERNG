const Validator = require('validator')
const validText = require('./valid_text')


module.exports = function validateRegisterInput(data) {
  
  data.username = validText(data.username) ? data.username : '';
  data.email = validText(data.email) ? data.email : '';
  data.password = validText(data.password) ? data.password : '';
  
  if (Validator.isEmpty(data.username)) {
    return { message: 'Username cannot be empty', isValid: false }
  }

  if (Validator.isEmpty(data.password)) {
    return { message: 'Password cannot be empty', isValid: false }
  }

  if (!Validator.isLength(data.password, { min: 7, max: 33 })) {
    return { message: 'Password must be a minimum of 8 and no longer than 32 characters', isValid: false }
  }

  if (!Validator.isEmail(data.email)) {
    return { message: 'Email is invalid', isValid: false }
  }

  return {
    message: '',
    isValid: true
  }
}

