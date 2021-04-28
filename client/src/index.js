import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import './index.css';
import App from './components/App';
import { ApolloClient, InMemoryCache,
         ApolloProvider, HttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import Cookies from 'js-cookie';
import Queries from './graphql/queries'
import Mutations from './graphql/mutations'

const { IS_LOGGED_IN } = Queries;
const { VERIFY_USER } = Mutations;

const token = Cookies.get('auth-token');

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: token ? token : "",
    }
  }
});

const httpLink = new HttpLink({
  uri: 'http://localhost:5000/graphql',
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  console.log(graphQLErrors)
  if (graphQLErrors)
  graphQLErrors.forEach(({ message, locations, path }) =>
    console.log(
      `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
    ),
  );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
       fields: {
         fetchLikesRepostsAndComments: {
           merge: (existing = [], incoming = []) => {
             return incoming
           }
        },
        fetchUserFeed: {
          keyArgs: ['query'],
            merge: (existing = [], incoming = []) => {
            const elements = [...existing, ...incoming].reduce((array, current) => {
              return array.map(i => i.__ref).includes(current.__ref) ? array : [...array, current];
            }, []);
            
            return elements
          },
        },
        fetchTagFeed: {
          keyArgs: ['query'],
            merge: (existing = [], incoming = []) => {
            const elements = [...existing, ...incoming].reduce((array, current) => {
              return array.map(i => i.__ref).includes(current.__ref) ? array : [...array, current];
            }, []);
            
            return elements
          },
        }
      }
    }
  }
  }),
  errorLink
})

client.writeQuery({
  query: IS_LOGGED_IN,
  data: {
    isLoggedIn: Boolean(token)
  }
})

if (token) {
  client
    .mutate({ mutation: VERIFY_USER, variables: { token } })
    .then(({ data }) => {
      client.writeQuery({
        query: IS_LOGGED_IN,
        data: {
          isLoggedIn: data.verifyUser.loggedIn
        }
      })
    })
}

const Root = () => {
  return (
    <ApolloProvider client={client}>
      <HashRouter>
        <App />
      </HashRouter>
    </ApolloProvider>
  )
}

ReactDOM.render(<Root />, document.getElementById('root'));
