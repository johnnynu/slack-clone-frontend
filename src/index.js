import React from 'react';
import ReactDOM from 'react-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  ApolloLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// import { setContext } from 'apollo-link-context';
import Routes from './routes';

import 'semantic-ui-css/semantic.min.css';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  mode: 'no-cors',
});

const middlewareLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  return {
    headers: {
      ...headers,
      'x-token': token,
      'x-refresh-token': refreshToken,
    },
  };
});

// afterwareLink not posting headers into response headers
const afterwareLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    const {
      response: { headers },
    } = operation.getContext();
    if (headers) {
      const token = headers.get('x-token');
      const refreshToken = headers.get('x-refresh-token');

      if (token) {
        localStorage.setItem('token', token);
      }

      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    }

    return response;
  });
});

const link = afterwareLink.concat(middlewareLink.concat(httpLink));

const client = new ApolloClient({
  link,
  fetchOptions: {
    credentials: 'include',
  },
  cache: new InMemoryCache(),
});

const App = (
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>
);

ReactDOM.render(App, document.getElementById('root'));
