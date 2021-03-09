const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const keys = require('../config/keys');
const validateRegisterInput = require('../validations/register');
const validateLoginInput = require('../validations/login');
const User = require('../models/User');
const bcrypt = require('bcryptjs')

const register = async data => {
  try {
  const { message, isValid } = validateRegisterInput(data)

  if (!isValid) {
    throw new Error(message)
  }

  const { username, email, password } = data;

  const existingUser = await User.findOne({ email })

  if (existingUser) {
    throw new Error('User already exists')
  }

  const hashedPW = await bcrypt.hash(password, 10)

  const user = new User(
    {
    username: username,
    email: email,
    password: hashedPW
    },
    err => {
      if (err) throw err;
    }
  )

  const token = await jwt.sign({ _id: user._id }, keys.secretOrKey)

  user.save();
  return { token, loggedIn: true, ...user._doc, password: '' }
  } catch (err) {
    throw err;
  }
}

const logout = async data => {
  try {
    const decoded = jwt.verify(data.token, keys.secretOrKey);
    const { _id } = decoded;

    const user = await User.findById({ _id })

    const token = '';

    return { token, loggedIn: false, ...user._doc }
  } catch (err) {
    throw err;
  }
}

const login = async data => {
  try {
    const { message, isValid } = validateLoginInput(data)

    if (!isValid) {
      throw new Error(message)
    }

    const { username, password } = data;

    const user = await User.findOne({ username })

    if (!user) {
      throw new Error('Username does not exist')
    }

    if (bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ _id: user._id }, keys.secretOrKey)
      return { token, loggedIn: true, ...user._doc }
    } else {
      throw new Error('Password is incorrect')
    }
  } catch(err) {
    throw err;
  }
}

const verify = async data => {
  try {
    const decoded = jwt.verify(data.token, keys.secretOrKey);
    const { _id } = decoded;
   
    const user = await User.findById({ _id });

    let loggedIn;
    
    if (user) {
      loggedIn = true;
      return { loggedIn, _id }
    } else {
      loggedIn = false;
      return { loggedIn }
    }
  } catch(err) {
    throw err
  }
}

module.exports = { register, logout, login, verify };