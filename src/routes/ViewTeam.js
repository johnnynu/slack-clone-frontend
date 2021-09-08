import React from 'react';
import { graphql } from '@apollo/client/react/hoc';
import findIndex from 'lodash/findIndex';
import { Redirect } from 'react-router-dom';

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

  if (!allTeams.length) {
    return <Redirect to="/create-team" />;
  }

  const teamIdInt = parseInt(teamId, 10);

  const teamIdx = teamIdInt ? findIndex(allTeams, ['id', teamIdInt]) : 0;
  const currentTeam = allTeams[teamIdx];

  const channelIdInt = parseInt(channelId, 10);
  const channelIdx = channelIdInt
    ? findIndex(currentTeam.channels, ['id', channelIdInt])
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
      {currentChannel && <Header channelName={currentChannel.name} />}
      {currentChannel && (
        <Messages channelId={currentChannel.id}>
          <ul className="message-list">
            <li />
            <li />
          </ul>
        </Messages>
      )}
      {currentChannel && (
        <SendMessage channelName={currentChannel.name}>
          <input type="text" placeholder="send a message!" />
        </SendMessage>
      )}
    </AppLayout>
  );
};

export default graphql(allTeamsQuery)(ViewTeam);
