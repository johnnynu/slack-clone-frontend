import React from 'react';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import Messages from '../components/Messages';

const MessageContainer = ({ data: { loading, messages } }) =>
  loading ? null : <Messages>{JSON.stringify(messages)}</Messages>;

const messagesQuery = gql`
  query ($channelId: Int!) {
    messages(channelId: $channelId) {
      id
      text
      user {
        username
      }
      createdAt
    }
  }
`;

export default graphql(messagesQuery, {
  variables: (props) => ({
    channelId: props.channelId,
  }),
})(MessageContainer);