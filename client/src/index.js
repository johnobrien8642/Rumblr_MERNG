import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import './index.css';
import App from './components/App';
import { ApolloClient, InMemoryCache,
         ApolloProvider } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import Queries from './graphql/queries'
import Mutations from './graphql/mutations'
const { IS_LOGGED_IN } = Queries;
const { VERIFY_USER } = Mutations;

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
  graphQLErrors.forEach(({ message, locations, path }) =>
    console.log(
      `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
    ),
  );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  headers: {
    authorization: localStorage.getItem('auth-token')
  },
  cache: new InMemoryCache(),
  errorLink
})

const token = localStorage.getItem('auth-token');

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
