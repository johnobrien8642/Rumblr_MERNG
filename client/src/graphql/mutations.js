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
    mutation RegisterUser($blogName: String!, $email: String!, $password: String!, $blogDescription: String) {
      registerUser(blogName: $blogName, email: $email, password: $password, blogDescription: $blogDescription) {
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
  LIKE_POST: gql`
    mutation LikePost($postId: ID, $user: String, $type: String) {
      likePost(postId: $postId, user: $user, type: $type) {
        _id
        post {
          __typename
          ... on PhotoPostType {
            ${PHOTO_POST}
          }
        }
      }
    }
  `,
  UNLIKE_POST: gql`
    mutation unlikePost($postId: ID, $likeId: ID, $user: String, $type: String) {
      unlikePost(postId: $postId, likeId: $likeId, user: $user, type: $type) {
        __typename
        ... on PhotoPostType {
          ${PHOTO_POST}
        }
      }
    }
  `,
  CREATE_PHOTO_POST: gql`
    mutation CreatePhotoPost($mainImages: [ImageInputType], $descriptionImages: [ImageInputType], $description: String, $tags: [String], $token: String, $user: String) {
      createPhotoPost(mainImages: $mainImages, descriptionImages: $descriptionImages, description: $description, tags: $tags, token: $token, user: $user) {
        ${PHOTO_POST}
      }
    }
  `,
  REPOST_PHOTO_POST: gql`
    mutation RepostPhotoPost($mainImages: [ImageInputType], $descriptionImages: [ImageInputType], $description: String, $tags: [String], $token: String, $reposter: String, $repostCaption: String, $user: String) {
      repostPhotoPost(mainImages: $mainImages, descriptionImages: $descriptionImages, description: $description, tags: $tags, token: $token, reposter: $reposter, repostCaption: $repostCaption, user: $user) {
        ${PHOTO_POST}
      }
    }
  `,
  FOLLOW_USER: gql`
    mutation FollowUser($currentUser: String, $user: String) {
      followUser(currentUser: $currentUser, user: $user) {
        _id
        blogName
      }
    }
  `,
  UNFOLLOW_USER: gql`
    mutation UnfollowUser($currentUser: String, $user: String) {
      unfollowUser(currentUser: $currentUser, user: $user) {
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