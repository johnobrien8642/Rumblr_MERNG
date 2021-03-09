import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ApolloClient, InMemoryCache,
         ApolloProvider } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

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

const Root = () => {
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  )
}


ReactDOM.render(<Root />, document.getElementById('root'));
