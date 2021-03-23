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
    mutation RegisterUser($blogName: String!, $email: String!, $password: String!) {
      registerUser(blogName: $blogName, email: $email, password: $password) {
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
    mutation CreatePost($mainImages: [ImageInputType], $bodyImages: [ImageInputType], $tags: [String]) {
      createPost(mainImages: $mainImages, bodyImages: $bodyImages, tags: $tags) {
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
        tags {
          _id
          title
        }
      }
    }
  `,
  FOLLOW_USER: gql`
    mutation FollowUser($userId: ID, $token: String) {
      followUser(userId: $userId, token: $token) {
        _id
        blogName
      }
    }
  `
};

export default Mutations;