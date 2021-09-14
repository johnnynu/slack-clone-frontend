import React from 'react';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import { Comment } from 'semantic-ui-react';
import Messages from '../components/Messages';

const MessageContainer = ({ data: { loading, allMessages } }) =>
  loading ? null : (
    <Messages>
      <Comment.Group>
        {allMessages.map((m) => (
          <Comment key={`${m.id}-message`}>
            <Comment.Content>
              <Comment.Author as="a">{m.user.username}</Comment.Author>
              <Comment.Metadata>
                <div>{m.createdAt}</div>
              </Comment.Metadata>
              <Comment.Text>{m.text}</Comment.Text>
              <Comment.Actions>
                <Comment.Action>Reply</Comment.Action>
              </Comment.Actions>
            </Comment.Content>
          </Comment>
        ))}
      </Comment.Group>
    </Messages>
  );

const allMessagesQuery = gql`
  query ($channelId: Int!) {
    allMessages(channelId: $channelId) {
      id
      text
      user {
        username
      }
      createdAt
    }
  }
`;

export default graphql(allMessagesQuery, {
  variables: (props) => ({
    channelId: props.channelId,
  }),
})(MessageContainer);
