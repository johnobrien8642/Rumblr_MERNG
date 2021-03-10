import { gql } from '@apollo/client';

const Queries = {
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