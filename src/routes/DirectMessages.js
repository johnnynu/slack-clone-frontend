import React from "react";
import { graphql } from "@apollo/client/react/hoc";
import findIndex from "lodash/findIndex";
import { Redirect } from "react-router-dom";
import { gql } from "@apollo/client";
import { flowRight as compose } from "lodash";

import AppLayout from "../components/AppLayout";
import SendMessage from "../components/SendMessage";
import Header from "../components/Header";
import Sidebar from "../containers/Sidebar";
import DirectMessageContainer from "../containers/DirectMessageContainer";
import { getUserQuery } from "../graphql/Team";

const ViewTeam = ({
  mutate,
  data: { loading, getUser, getUserWithNameDisplay },
  match: {
    params: { teamId, userId }
  }
}) => {
  if (loading) {
    return null;
  }

  const { teams, username } = getUser;

  if (!teams.length) {
    return <Redirect to="/create-team" />;
  }

  const teamIdInt = parseInt(teamId, 10);

  const teamIdx = teamIdInt ? findIndex(teams, ["id", teamIdInt]) : 0;
  const currentTeam = teamIdx === -1 ? teams[0] : teams[teamIdx];

  return (
    <AppLayout>
      <Sidebar
        teams={teams.map((team) => ({
          id: team.id,
          letter: team.name.charAt(0).toUpperCase()
        }))}
        team={currentTeam}
        username={username}
      />
      <Header channelName={getUserWithNameDisplay.username} />
      <DirectMessageContainer teamId={teamId} userId={userId} />
      <SendMessage
        onSubmit={async (text) => {
          const response = await mutate({
            variables: {
              text,
              receiverId: parseInt(userId, 10),
              teamId: parseInt(teamId, 10)
            },
            optimisticResponse: { createDirectMessage: true },
            refetchQueries: [{ query: getUserQuery }]
          });
          console.log(response);
        }}
        placeholder={userId}
      >
        <input type="text" placeholder="send a message!" />
      </SendMessage>
    </AppLayout>
  );
};

const createDirectMessageMutation = gql`
  mutation ($receiverId: Int!, $text: String!, $teamId: Int!) {
    createDirectMessage(receiverId: $receiverId, text: $text, teamId: $teamId)
  }
`;

const directMessageGetUserQuery = gql`
  query ($userId: Int!) {
    getUserWithNameDisplay(userId: $userId) {
      username
    }
    getUser {
      id
      username

      teams {
        id
        name
        admin
        directMessageMembers {
          id
          username
        }
        channels {
          id
          name
        }
      }
    }
  }
`;

export default compose(
  graphql(directMessageGetUserQuery, {
    options: (props) => ({
      variables: { userId: parseInt(props.match.params.userId, 10) },
      fetchPolicy: "network-only"
    })
  }),
  graphql(createDirectMessageMutation)
)(ViewTeam);
