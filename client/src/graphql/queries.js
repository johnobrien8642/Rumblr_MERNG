import { gql } from '@apollo/client';

const Queries = {
  FETCH_USER_FEED: gql`
    query fetchUserFeed($token: String) {
      currentUser(token: $token) {
        _id
        posts {
          __typename
          ... on PhotoPostType {
            _id
            description
            user {
              _id
              blogName
            }
            mainImages {
              _id
              url
            }
            descriptionImages {
              _id
              url
            }
            tags {
              _id
              title
            }
            createdAt
          }
        }
        userFollowing {
          _id
          posts {
            __typename
            ... on PhotoPostType {
              _id
              mainImages {
                _id
                url
              }
              descriptionImages {
                _id
                url
              }
              tags {
                _id
                title
              }
            }
          }
        }
        tagFollows {
          posts {
            __typename
            ... on PhotoPostType {
              _id
              mainImages {
                _id
                url
              }
              descriptionImages {
                _id
                url
              }
              tags {
                _id
                title
              }
            }
          }
        }
      }
    }
  `,
  FETCH_USER_LIKED_POSTS: gql`
    query fetchUserPostLikes($token: String) {
      currentUser(token: $token) {
        _id
        likedPosts {
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
            tags {
              _id
              title
            }
          }
        }
      }
    }
  `,
  FETCH_USER_FOLLOWING: gql`
    query fetchUserFollowing($token: String) {
      currentUser(token: $token) {
        _id
        userFollowing {
          _id
          blogName
        }
      }
    }
  `,
  FETCH_USER_BLOG: gql`
    query fetchUserBlog($token: String) {
      currentUser(token: $token) {
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
            tags {
              _id
              title
            }
            user {
              _id
              blogName
            }
          }
        }
      }
    }
  `,
  FETCH_USER_DETAILS_COUNTS: gql`
    query FetchUserDetailsCounts($token: String) {
      currentUser(token: $token) {
        _id
        blogName
        userFollowCount
        postLikeCount
      }
    }
  `,
  FETCH_USER_DETAILS: gql`
    query fetchUserDetails {
      currentUser {
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
              tags {
                _id
                title
              }
            }
          }
        }
      }
    }
  `,
  FETCH_USER_FOLLOWED_TAGS: gql`
    query fetchUserAndFollowedTags {
      currentUser {
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