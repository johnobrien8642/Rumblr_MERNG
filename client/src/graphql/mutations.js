import { gql } from '@apollo/client';

const Mutations = {
  LOGIN_USER: gql`
    mutation LoginUser($LoginUserInput: LoginUserInput) {
      loginUser(LoginUserInput: $LoginUserInput) {
        token
        loggedIn
      }
    }
  `,
  REGISTER_USER: gql`
    mutation RegisterUser($NewUserInput: NewUserInput) {
      registerUser(NewUserInput: $NewUserInput) {
        token
        loggedIn
      }
    }
  `,
  VERIFY_USER: gql`
    mutation VerifyUser($token: String!) {
      verifyUser(token: $token) {
        loggedIn
      }
    }
  `,
  LOGOUT_USER: gql`
    mutation LogoutUser($token: String!) {
      logoutUser(token: $token) {
        token
        loggedIn
      }
    }
  `,
  CREATE_POST: gql`
    mutation CreatePost($mainImages: [ImageInputType], $bodyImages: [ImageInputType]) {
      createPost(mainImages: $mainImages, bodyImages: $bodyImages) {
        _id
        mainImages {
          _id
          url
          created
        }
        bodyImages {
          _id
          url
          created
        }
      }
    }
  `
};

export default Mutations;