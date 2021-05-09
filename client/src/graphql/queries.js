import { gql } from '@apollo/client';
import AllPostQueryFragment from './all_posts_query_fragment.js';
const { ALL_POSTS, ALL_POSTS_ACTIVITY } = AllPostQueryFragment;

const Queries = {
  FETCH_USER_FEED: gql`
    query FetchUserFeed($query: String, $cursorId: String) {
      fetchUserFeed(query: $query, cursorId: $cursorId) {
        __typename
        ... on RepostType {
          _id
          kind
          user {
            _id
            blogName
          }
          repostTrail {
            _id
            blogName
          }
          repostCaptions {
            _id
            caption
          }
          repostedFrom {
            _id
            blogName
          }
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
    query FetchTagFeed($query: String, $cursorId: String) {
      fetchTagFeed(query: $query, cursorId: $cursorId) {
        __typename
        ${ALL_POSTS}
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
    query fetchFollowedUsers($query: String, $cursorId: String) {
      fetchFollowedUsers(query: $query, cursorId: $cursorId) {
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
  FETCH_USER_FOLLOWERS: gql`
    query FetchUserFollowers($query: String, $cursorId: String) {
      fetchUserFollowers(query: $query, cursorId: $cursorId) {
        _id
        user {
          _id
          blogName
          blogDescription
        }
      }
    }
  `,
  FETCH_CURRENT_USER_BLOG: gql`
    query fetchUserBlog($query: String) {
      user(query: $query) {
        _id
        posts {
          __typename
          ${ALL_POSTS}
        }
      }
    }
  `,
  FETCH_USER_BLOG: gql`
    query fetchUserBlog($query: String) {
      user(query: $query) {
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
    query FetchUserDetailsCounts($query: String) {
      user(query: $query) {
        _id
        blogName
        blogDescription
        email
        filteredTags
        filteredPostContent
        userFollowCount
        totalLikeCount
        followersCount
        userPostsCount
      }
    }
  `,
  FETCH_USER_DETAILS: gql`
    query fetchUserDetails($query: String) {
      user(query: $query) {
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
    query fetchUserAndFollowedTags($query: String) {
      user(query: $query) {
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
    query FetchPost($query: ID) {
      post(query: $query) {
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
          repostCaptions {
            _id
            caption
          }
          repostTrail {
            _id
            blogName
          }
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
    query FetchTag($query: String) {
      tag(query: $query) {
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
  FETCH_ALL_ACTIVITY: gql`
  query FetchAllUserActivity($query: String, $cursorId: String) {
    fetchAllUserActivity(query: $query, cursorId: $cursorId) {
        __typename
        ... on MentionType {
          _id
          kind
          user {
            _id
            blogName
          }
          post {
            __typename
            ${ALL_POSTS_ACTIVITY}
          }
        }
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
          post {
            __typename
            ${ALL_POSTS_ACTIVITY}
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
          post {
            __typename
            ${ALL_POSTS_ACTIVITY}
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
          post {
            __typename
            ${ALL_POSTS_ACTIVITY}
          }
        }
        ... on FollowType {
          _id
          kind
          user {
            _id
            blogName
          }
          follows {
            __typename
            ... on TagType {
              _id
            }
            ... on UserType {
              _id
              blogName
            }
          }
        }
      }
    }
  `,
  FETCH_ACTIVITY_COUNTS: gql`
    query FetchActivityCounts($query: String, $cursorId: String) {
      fetchActivityCounts(query: $query, cursorId: $cursorId) {
        mentionsCount
        repostsCount
        commentsCount
      }
    }
  `,
  FETCH_USERS_FOR_MENTIONS: gql`
    query FetchUsersForMentions($filter: String) {
      fetchUsersForMentions(filter: $filter) {
        _id
        blogName
        blogDescription
      }
    }
  `,
  FETCH_RECOMMENDED_TAGS: gql`
    query FetchRecommendedTags($query: String) {
      fetchRecommendedTags(query: $query) {
        _id
        title
      }
    }
  `,
  FETCH_ALL_TAG_FEED: gql`
    query FetchAllTagFeed($query: String) {
      fetchAllTagFeed(query: $query) {
        __typename
        ${ALL_POSTS}
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
    query DoesUserFollowTag($query: String, $tagId: ID) {
      doesUserFollowTag(query: $query, tagId: $tagId) {
        _id
      }
    }
  `,
  IS_LOGGED_IN: gql`
    query isLoggedIn {
       isLoggedIn @client
     } 
    `,
  FETCH_USER: gql`
    query fetchUser($query: String) {
      user(query: $query) {
        _id
        blogName
        blogDescription
        filteredTags
        filteredPostContent
        email
      }
    }
  `,
}

export default Queries;