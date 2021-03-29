import { gql } from '@apollo/client';
import QueryFragments from '../graphql/query_fragments'
const { PHOTO_POST } = QueryFragments;

const Mutations = {
  LOGIN_USER: gql`
    mutation LoginUser($email: String!, $password: String!) {
      loginUser(email: $email, password: $password) {
        token
        loggedIn
        blogName
      }
    }
  `,
  REGISTER_USER: gql`
    mutation RegisterUser($blogName: String!, $email: String!, $password: String!) {
      registerUser(blogName: $blogName, email: $email, password: $password) {
        token
        loggedIn
        blogName
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
        blogName
      }
    }
  `,
  CREATE_PHOTO_POST: gql`
    mutation CreatePhotoPost($mainImages: [ImageInputType], $descriptionImages: [ImageInputType], $description: String, $tags: [String], $token: String) {
      createPhotoPost(mainImages: $mainImages, descriptionImages: $descriptionImages, description: $description, tags: $tags, token: $token) {
        _id
        description
        createdAt
        user {
          _id
        }
        mainImages {
          _id
          url
          createdAt
        }
        descriptionImages {
          _id
          url
          createdAt
        }
        tags {
          _id
          title
        }
      }
    }
  `,
  FOLLOW_USER: gql`
    mutation FollowUser($userId: ID) {
      followUser(userId: $userId) {
        _id
        blogName
      }
    }
  `,
  UNFOLLOW_USER: gql`
    mutation UnfollowUser($userId: ID, $token: String) {
      unfollowUser(userId: $userId, token: $token) {
        _id
        blogName
      }
    }
  `,
  FOLLOW_TAG: gql`
    mutation FollowTag($tagId: ID, $token: String) {
      followTag(tagId: $tagId, token: $token) {
        _id
        title
        posts {
          __typename
          ... on PhotoPostType {
            ${PHOTO_POST}
          }
        }
        user {
          _id
          blogName
        }
      }
    } 
  `
};

export default Mutations;