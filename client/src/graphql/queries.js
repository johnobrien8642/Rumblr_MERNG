import { gql } from '@apollo/client';
import QueryFragments from './query_fragments.js';
const { PHOTO_POST } = QueryFragments;

const Queries = {
  FETCH_USER_FEED: gql`
    query fetchUserFeed($blogName: String) {
      user(blogName: $blogName) {
        _id
        blogName
        posts {
          __typename
          ... on PhotoPostType {
            ${PHOTO_POST}
          }
        }
        reposts {
          _id
          createdAt
          post {
            __typename
            ... on PhotoPostType {
              ${PHOTO_POST}
            }
          }
        }
        userFollowing {
          _id
          posts {
            __typename
            ... on PhotoPostType {
              ${PHOTO_POST}
            }
          }
        }
        tagFollows {
          _id
          posts {
            __typename
            ... on PhotoPostType {
              ${PHOTO_POST}
            }
          }
        }
      }
    }
  `,
  FETCH_USER_LIKED_POSTS: gql`
    query fetchUserPostLikes($blogName: String) {
      user(blogName: $blogName) {
        _id
        likedPosts {
          __typename
          ... on PhotoPostType {
            ${PHOTO_POST}
          }
        }
      }
    }
  `,
  FETCH_USER_FOLLOWING: gql`
    query fetchUserFollowing($blogName: String) {
      user(blogName: $blogName) {
        _id
        userFollowing {
          _id
          blogName
        }
      }
    }
  `,
  FETCH_CURRENT_USER_BLOG: gql`
    query fetchUserBlog($blogName: String) {
      user(blogName: $blogName) {
        _id
        posts {
          __typename
          ... on PhotoPostType {
            ${PHOTO_POST}
          }
        }
      }
    }
  `,
  FETCH_USER_BLOG: gql`
    query fetchUserBlog($blogName: String) {
      user(blogName: $blogName) {
        _id
        blogName
        posts {
          __typename
          ... on PhotoPostType {
            ${PHOTO_POST}
          }
        }
        reposts {
          post {
            __typename
            ... on PhotoPostType {
              ${PHOTO_POST}
            }
          }
        }
      }
    }
  `,
  FETCH_USER_DETAILS_COUNTS: gql`
    query FetchUserDetailsCounts($blogName: String) {
      user(blogName: $blogName) {
        _id
        blogName
        userFollowCount
        postLikeCount
      }
    }
  `,
  FETCH_USER_DETAILS: gql`
    query fetchUserDetails($blogName: String) {
      user(blogName: $blogName) {
        _id
        blogname
        userFollows {
          _id
          blogName
        }
        postLikes {
          _id
          post {
            __typename
            ... on PhotoPostType {
              ${PHOTO_POST}
            }
          }
        }
      }
    }
  `,
  FETCH_USER_FOLLOWED_TAGS: gql`
    query fetchUserAndFollowedTags($blogName: String) {
      user(blogName: $blogName) {
        _id
        tagFollows {
          _id
          title
        }
      }
    }
  `,
  SEARCH_USERS_AND_TAGS: gql`
    query SearchUsersAndTags($filter: UserAndTagInputType) {
      usersAndTags(filter: $filter) {
        __typename
        ... on UserType {
          _id
          blogName
          email
        }
        ... on TagType {
          _id
          title
        }
      }
    }
  `,
  FETCH_MATCHING_TAGS: gql`
    query FetchMatchingTags($filter: String) {
      fetchMatchingTags(filter: $filter) {
        _id
        title
      }
    }
  `,
  FETCH_USERS: gql`
    {
      users {
        _id
        username
      }
    }
  `,
  IS_LOGGED_IN: gql`
    query isLoggedIn {
       isLoggedIn @client
     } 
    `,
}

export default Queries;