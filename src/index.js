import React from 'react';
import ReactDOM from 'react-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  ApolloLink,
  split,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

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

const httpLinkWithMiddleware = afterwareLink.concat(
  middlewareLink.concat(httpLink)
);

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/graphql',
  options: {
    reconnect: true,
    connectionParams: {
      token: localStorage.getItem('token'),
      refreshToken: localStorage.getItem('refreshToken'),
    },
  },
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLinkWithMiddleware
);

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
