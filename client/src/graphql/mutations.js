import { gql } from '@apollo/client';
import AllPostQueryFragments from './all_posts_query_fragment.js'
const { ALL_POSTS } = AllPostQueryFragments;

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
  FOLLOW: gql`
    mutation Follow($user: String, $item: String, $itemKind: String) {
      follow(user: $user, item: $item, itemKind: $itemKind) {
        _id
      }
    }
  `,
  UNFOLLOW: gql`
    mutation Unfollow($followId: ID) {
      unfollow(followId: $followId) {
        _id
      }
    }
  `,
  CREATE_POST: gql`
    mutation CreatePost($instanceData: JSONObject ) {
      createPost(instanceData: $instanceData) {
        __typename
       ${ALL_POSTS}
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
          ${ALL_POSTS}
        }
      }
    }
  `,
  
};

export default Mutations;