import { gql } from '@apollo/client';

const Queries = {
  GET_USER_FEED: gql`
    query getUserFeed {
      currentUser {
        _id
        posts {
          __typename
          ... on PhotoPostType {
            _id
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
          }
        }
        userFollows {
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
  SEARCH_USERS_AND_TAGS: gql`
    query SearchUsersAndTags($filter: UserAndTagInputType) {
      usersAndTags(filter: $filter) {
        __typename
        ... on UserType{
          _id
          blogName
          email
        }
        ... on TagType{
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