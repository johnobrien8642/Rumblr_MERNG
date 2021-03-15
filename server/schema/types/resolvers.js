const mongoose = require('mongoose');
const User = mongoose.model('users');
const AuthService = require('../../services/auth_util');


const Resolvers = {
  Query: {
    users: () => {
      return User.find({})
    },
    user: (parent, args) => {
      return User.find(args._id)
    }
  },
  Mutation: {
    registerUser: (parent, { NewUserInput }) => {
      return AuthService.register(NewUserInput)
    },
    loginUser: (parent, { LoginUserInput }) => {
      return AuthService.login(LoginUserInput)
    },
    logoutUser: (parent, args) => {
      return AuthService.logout(args)
    },
    verifyUser: (parent, args) => {
      return AuthService.verify(args)
    }
  }
}

module.exports = Resolvers;