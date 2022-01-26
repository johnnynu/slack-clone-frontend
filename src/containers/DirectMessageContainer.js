import React from "react";
import { gql } from "@apollo/client";
import { graphql } from "@apollo/client/react/hoc";
import { Comment } from "semantic-ui-react";
import Messages from "../components/Messages";

const newDirectMessageSubscription = gql`
  subscription ($teamId: Int!, $userId: Int!) {
    newDirectMessage(teamId: $teamId, userId: $userId) {
      id
      sender {
        username
      }
      text
      createdAt
    }
  }
`;

class DirectMessageContainer extends React.Component {
  /* eslint camelcase: ["error", {allow: ["UNSAFE_componentWillMount"]}] */

  UNSAFE_componentWillMount() {
    this.unsubscribe = this.subscribe(
      parseInt(this.props.teamId, 10),
      parseInt(this.props.userId, 10)
    );
  }

  componentWillReceiveProps({ teamId, userId }) {
    const parsedTeamId = parseInt(teamId, 10);
    const parsedUserId = parseInt(userId, 10);
    if (
      parseInt(this.props.teamId, 10) !== parsedTeamId ||
      parseInt(this.props.userId, 10) !== parsedUserId
    ) {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      this.unsubscribe = this.subscribe(parsedTeamId, parsedUserId);
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  subscribe = (teamId, userId) => {
    const temp = this.props.data.subscribeToMore({
      document: newDirectMessageSubscription,
      variables: { teamId, userId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        return {
          ...prev,
          directMessages: [
            ...prev.directMessages,
            subscriptionData.data.newDirectMessage
          ]
        };
      }
    });
    return temp;
  };

  render() {
    const {
      data: { loading, directMessages }
    } = this.props;
    return loading ? null : (
      <Messages>
        <Comment.Group>
          {directMessages.map((m) => (
            <Comment key={`${m.id}-direct-message`}>
              <Comment.Content>
                <Comment.Author as="a">{m.sender.username}</Comment.Author>
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

const directMessagesQuery = gql`
  query ($teamId: Int!, $userId: Int!) {
    directMessages(teamId: $teamId, otherUserId: $userId) {
      id
      sender {
        username
      }
      text
      createdAt
    }
  }
`;

// if error is undefined from a query call: check network tab to see if the data type being passed in is correct
export default graphql(directMessagesQuery, {
  options: (props) => ({
    variables: {
      teamId: parseInt(props.teamId, 10),
      userId: parseInt(props.userId, 10)
    },
    fetchPolicy: "network-only"
  })
})(DirectMessageContainer);
