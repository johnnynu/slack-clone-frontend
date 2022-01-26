import React from "react";
import { gql } from "@apollo/client";
import { graphql } from "@apollo/client/react/hoc";
import { Comment } from "semantic-ui-react";
import Messages from "../components/Messages";

const newChannelMessageSubscription = gql`
  subscription ($channelId: Int!) {
    newChannelMessage(channelId: $channelId) {
      id
      text
      user {
        username
      }
      createdAt
    }
  }
`;

class MessageContainer extends React.Component {
  /* eslint camelcase: ["error", {allow: ["UNSAFE_componentWillMount"]}] */

  UNSAFE_componentWillMount() {
    this.unsubscribe = this.subscribe(this.props.channelId);
  }

  componentWillReceiveProps({ channelId }) {
    if (this.props.channelId !== channelId) {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      this.unsubscribe = this.subscribe(channelId);
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  subscribe = (channelId) => {
    return this.props.data.subscribeToMore({
      document: newChannelMessageSubscription,
      variables: { channelId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        return {
          ...prev,
          allMessages: [
            ...prev.allMessages,
            subscriptionData.data.newChannelMessage
          ]
        };
      }
    });
  };

  render() {
    const {
      data: { loading, allMessages }
    } = this.props;
    return loading ? null : (
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
  }
}

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
  options: (props) => ({
    variables: {
      channelId: props.channelId
    },
    fetchPolicy: "network-only"
  })
})(MessageContainer);
