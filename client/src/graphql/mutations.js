import { gql } from '@apollo/client';
import QueryFragments from '../graphql/query_fragments'
const { TEXT_POST, PHOTO_POST } = QueryFragments;

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
    mutation LikePost($postId: ID, $user: String, $postKind: String) {
      likePost(postId: $postId, user: $user, postKind: $postKind) {
        _id
      }
    }
  `,
  UNLIKE_POST: gql`
    mutation unlikePost($likeId: ID) {
      unlikePost(likeId: $likeId) {
        _id
      }
    }
  `,
  CREATE_TEXT_POST: gql`
    mutation CreateTextPost($title: String, $body: String, $descriptionImages: [ImageInputType], $user: String, $tags: [String]) {
      createTextPost(title: $title, body: $body, descriptionImages: $descriptionImages, user: $user, tags: $tags) {
        ${TEXT_POST}
      }
    }
  `,
  CREATE_PHOTO_POST: gql`
    mutation CreatePhotoPost($mainImages: [ImageInputType], $descriptionImages: [ImageInputType], $description: String, $tags: [String], $user: String) {
      createPhotoPost(mainImages: $mainImages, descriptionImages: $descriptionImages, description: $description, tags: $tags, user: $user) {
        ${PHOTO_POST}
      }
    }
  `,
  CREATE_REPOST: gql`
    mutation repost($postId: ID, $repostCaption: String, $user: String, $repostedFrom: String, $postKind: String) {
      repost(postId: $postId, repostCaption: $repostCaption, user: $user, repostedFrom: $repostedFrom, postKind: $postKind) {
        _id
        repostedFrom {
          _id
          blogName
        }
        user {
          _id
          blogName
        }
        repostCaption
        post {
          __typename
          ... on TextPostType {
            ${TEXT_POST}
          }
          ... on PhotoPostType {
            ${PHOTO_POST}
          }
        }
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