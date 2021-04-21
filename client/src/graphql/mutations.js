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
  DELETE_POST: gql`
    mutation deletePost($post: JSONObject ) {
      deletePost(post: $post)
    }
  `,
  CREATE_REPOST: gql`
    mutation CreateRepost($repostData: JSONObject ) {
      repost(repostData: $repostData) {
       _id
       post {
         ${ALL_POSTS}
       }
      }
    }
  `,
  COMMENT_POST: gql`
  mutation CommentPost($commentData: JSONObject) {
    comment(commentData: $commentData) {
      _id
      content
      user {
        _id
        blogName
      }
    }
  }
`,
DELETE_COMMENT: gql`
  mutation deleteComment($commentId: ID) {
    deleteComment(commentId: $commentId) {
      _id
    }
  }
`
};

export default Mutations;