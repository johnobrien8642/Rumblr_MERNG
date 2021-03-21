import { gql } from '@apollo/client';

const Queries = {
  SEARCH_USER_AND_POSTS: gql`
    query SearchUsersAndPosts($filter: UserAndPostInputType) {
      usersAndPosts(filter: $filter) {
        __typename 
        ... on UserType{
          _id
          blogName
          email
        }
        ... on PostType{
          _id
          mainImages {
            _id
            url
          }
          bodyImages {
            _id
            url
          }
        }
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