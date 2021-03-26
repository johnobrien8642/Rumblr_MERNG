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
  CREATE_PHOTO_POST: gql`
    mutation CreatePhotoPost($mainImages: [ImageInputType], $descriptionImages: [ImageInputType], $tags: [String]) {
      createPhotoPost(mainImages: $mainImages, descriptionImages: $descriptionImages, tags: $tags) {
        _id
        user {
          _id
        }
        mainImages {
          _id
          url
          created
        }
        descriptionImages {
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
    mutation FollowTag($tagId: ID) {
      followTag(tagId: $tagId) {
        tag {
          _id
          posts {
            __typename
            ... on PhotoPostType {
              _id
              description
              mainImages {
                _id
                url
              }
              descriptionImages {
                _id
                url
              }
            }
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