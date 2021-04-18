import { gql } from '@apollo/client';
import AllPostQueryFragment from './all_posts_query_fragment.js';
const { ALL_POSTS } = AllPostQueryFragment;

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
            ${ALL_POSTS}
          }
        }
        ${ALL_POSTS}
      }
    }
  `,
  FETCH_TAG_FEED: gql`
    query FetchUserFeed($query: String) {
      fetchTagFeed(query: $query) {
        __typename
        ${ALL_POSTS}
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
  FETCH_USER_LIKES: gql`
    query FetchUserLikes($user: String) {
      fetchUserLikes(user: $user) {
        _id
        kind
        user {
          _id
          blogName
        }
        post {
          __typename
          ... on RepostType {
            _id
            kind
            post {
              __typename
              ${ALL_POSTS}
            }
          }
          ${ALL_POSTS}
        }
      }
    }
  `,
  FETCH_FOLLOWED_USERS: gql`
    query fetchFollowedUsers($user: String) {
      fetchFollowedUsers(user: $user) {
        _id
        follows {
          __typename
          ... on UserType {
            _id
            blogName
            blogDescription
            kind
          }
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
          ${ALL_POSTS}
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
          ${ALL_POSTS}
        }
        reposts {
          post {
            __typename
            ${ALL_POSTS}
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
            ${ALL_POSTS}
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
          kind
        }
        ... on TagType {
          _id
          title
          kind
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
    query FetchPost($postId: ID) {
      post(postId: $postId) {
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
            ${ALL_POSTS}
          }
        }
        ${ALL_POSTS}
      }
    }
  `,
  FETCH_TAG: gql`
    query FetchTag($tagTitle: String) {
      tag(tagTitle: $tagTitle) {
        _id
        title
      }
    }
  `,
  FETCH_LIKES_REPOSTS_AND_COMMENTS: gql`
  query FetchLikesRepostsAndComments($postId: ID) {
    fetchLikesRepostsAndComments(postId: $postId) {
        __typename
        ... on LikeType {
          _id
          kind
          user {
            _id
            blogName
          }
        }
        ... on RepostType {
          _id
          kind
          repostCaption
          user {
            _id
            blogName
          }
          repostedFrom {
            _id
            blogName
          }
        }
        ... on CommentType {
          _id
          kind
          content
          user {
            _id
            blogName
          }
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
    query DoesUserFollowUser($user: String, $otherUser: String) {
      doesUserFollowUser(user: $user, otherUser: $otherUser) {
        _id
      }
    }
  `,
  DOES_USER_FOLLOW_TAG: gql`
    query DoesUserFollowTag($user: String, $tagId: ID) {
      doesUserFollowTag(user: $user, tagId: $tagId) {
        _id
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