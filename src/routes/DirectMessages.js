import React from 'react';
import { graphql } from '@apollo/client/react/hoc';
import findIndex from 'lodash/findIndex';
import { Redirect } from 'react-router-dom';
import { gql } from '@apollo/client';
import { flowRight as compose } from 'lodash';

import AppLayout from '../components/AppLayout';
import SendMessage from '../components/SendMessage';
import Header from '../components/Header';
import Sidebar from '../containers/Sidebar';
import MessageContainer from '../containers/MessageContainer';
import { getUserQuery } from '../graphql/Team';

const ViewTeam = ({
  data: { loading, getUser },
  match: {
    params: { teamId, userId },
  },
}) => {
  if (loading) {
    return null;
  }

  const { teams, username } = getUser;

  if (!teams.length) {
    return <Redirect to="/create-team" />;
  }

  const teamIdInt = parseInt(teamId, 10);

  const teamIdx = teamIdInt ? findIndex(teams, ['id', teamIdInt]) : 0;
  const currentTeam = teamIdx === -1 ? teams[0] : teams[teamIdx];

  return (
    <AppLayout>
      <Sidebar
        teams={teams.map((team) => ({
          id: team.id,
          letter: team.name.charAt(0).toUpperCase(),
        }))}
        team={currentTeam}
        username={username}
      />
      {/* <Header channelName={currentChannel.name} />
      <MessageContainer channelId={currentChannel.id} /> */}
      <SendMessage onSubmit={() => {}} placeholder={userId}>
        <input type="text" placeholder="send a message!" />
      </SendMessage>
    </AppLayout>
  );
};

const createMessageMutation = gql`
  mutation ($channelId: Int!, $text: String!) {
    createMessage(channelId: $channelId, text: $text)
  }
`;

export default compose(
  graphql(getUserQuery, {
    options: { fetchPolicy: 'network-only' },
  }),
  graphql(createMessageMutation)
)(ViewTeam);
