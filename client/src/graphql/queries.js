import { gql } from '@apollo/client';
import QueryFragments from './query_fragments.js';
const { TEXT_POST, PHOTO_POST } = QueryFragments;

const Queries = {
  FETCH_USER_FEED: gql`
    query FetchUserFeed($query: String) {
      fetchUserFeed(query: $query) {
        __typename
        ... on RepostType {
          _id
          kind
          user {
            _id
            blogName
          }
          repostedFrom {
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
        ... on TextPostType {
          ${TEXT_POST}
        }
        ... on PhotoPostType {
          ${PHOTO_POST}
        }
      }
    }
  `,
  FETCH_TAG_FEED: gql`
    query FetchUserFeed($query: String) {
      fetchTagFeed(query: $query) {
        __typename
        ... on TextPostType {
          ${TEXT_POST}
        }
        ... on PhotoPostType {
          ${PHOTO_POST}
        }
      }
    }
  `,
  FETCH_USER: gql`
    query fetchUser($blogName: String) {
      user(blogName: $blogName) {
        _id
        blogName
        blogDescription
      }
    }
  `,
  FETCH_USER_LIKED_POSTS: gql`
    query fetchUserPostLikes($blogName: String) {
      user(blogName: $blogName) {
        _id
        likes {
          _id
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
  FETCH_USER_BLOG: gql`
    query fetchUserBlog($blogName: String) {
      user(blogName: $blogName) {
        _id
        blogName
        posts {
          __typename
          ... on TextPostType {
            ${TEXT_POST}
          }
          ... on PhotoPostType {
            ${PHOTO_POST}
          }
        }
        reposts {
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
    }
  `,
  FETCH_USER_DETAILS_COUNTS: gql`
    query FetchUserDetailsCounts($blogName: String) {
      user(blogName: $blogName) {
        _id
        blogName
        userFollowCount
        totalLikeCount
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
            ... on TextPostType {
              ${TEXT_POST}
            }
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
  FETCH_POST: gql`
    query FetchPost($postId: ID, $type: String) {
      post(postId: $postId, type: $type ) {
        __typename
        ... on TextPostType {
          ${TEXT_POST}
        }
        ... on PhotoPostType {
          ${PHOTO_POST}
        }
      }
    }
  `,
  DOES_USER_LIKE_POST: gql`
    query DoesUserLikePost($user: String, $postId: ID) {
      doesUserLikePost(user: $user, postId: $postId) {
        _id
      }
    }
  `,
  DOES_USER_FOLLOW_USER: gql`
    query DoesUserFollowUser($currentUser: String, $userId: ID) {
      doesUserFollowUser(currentUser: $currentUser, userId: $userId)
    }
  `,
  IS_LOGGED_IN: gql`
    query isLoggedIn {
       isLoggedIn @client
     } 
    `,
}

export default Queries;