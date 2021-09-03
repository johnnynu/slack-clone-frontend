import React from 'react';
import { graphql } from '@apollo/client/react/hoc';
import findIndex from 'lodash/findIndex';

import AppLayout from '../components/AppLayout';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';
import Header from '../components/Header';
import Sidebar from '../containers/Sidebar';
import { allTeamsQuery } from '../graphql/Team';

const ViewTeam = ({
  data: { loading, allTeams },
  match: {
    params: { teamId, channelId },
  },
}) => {
  if (loading) {
    return null;
  }

  const teamIdx = teamId
    ? findIndex(allTeams, ['id', parseInt(teamId, 10)])
    : 0;
  const currentTeam = allTeams[teamIdx];

  const channelIdx = channelId
    ? findIndex(currentTeam.channels, ['id', parseInt(channelId, 10)])
    : 0;
  const currentChannel = currentTeam.channels[channelIdx];

  return (
    <AppLayout>
      <Sidebar
        teams={allTeams.map((team) => ({
          id: team.id,
          letter: team.name.charAt(0).toUpperCase(),
        }))}
        team={currentTeam}
      />
      <Header channelName={currentChannel.name} />
      <Messages channelId={currentChannel.id}>
        <ul className="message-list">
          <li />
          <li />
        </ul>
      </Messages>
      <SendMessage channelName={currentChannel.name}>
        <input type="text" placeholder="send a message!" />
      </SendMessage>
    </AppLayout>
  );
};

export default graphql(allTeamsQuery)(ViewTeam);
