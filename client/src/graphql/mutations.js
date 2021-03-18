import { gql } from '@apollo/client';

const Mutations = {
  LOGIN_USER: gql`
    mutation LoginUser($email: String!, $password: String!) {
      loginUser(email: $email, password: $password) {
        token
        loggedIn
      }
    }
  `,
  REGISTER_USER: gql`
    mutation RegisterUser($email: String!, $username: String!, $password: String!) {
      registerUser(email: $email, username: $username, password: $password) {
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