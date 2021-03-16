const mongoose = require('mongoose');
const User = mongoose.model('users');
const AuthService = require('../../services/auth_util');
const fs = require('fs/promises');

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
    },
    createPost: async (_, { file }) => {
      const { stream, filename, mimetype, encoding } = await file;

      return { filename, mimetype, encoding, url: ''}
    }
  }
}

module.exports = Resolvers;

// let process_upload = async upload => {
  //     let { filename, mimetype, encoding, createReadStream } = await upload
  //     let stream = createReadStream();
      
  //     let path = '/tmp/' + filename

  //     return new Promise((resolve, reject) => 
  //       stream
  //         .on('error', error => {
  //           if (stream.truncated)
  //             fs.unlinkSync(path)
  //           reject(error)
  //         })
  //         .pipe(fs.createWriteStream(path))
  //         .on('finish', () => resolve({
  //           path, filenam, mimetype, encoding
  //         }))
  //     ) 
  //   }

  //   Promise
  //     .all(mainImages.map(process_upload))
  //     .then(bodyImages.map(process_upload))
  // }