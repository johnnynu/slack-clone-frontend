import React from 'react';
import { graphql } from '@apollo/client/react/hoc';
import findIndex from 'lodash/findIndex';
import { Redirect } from 'react-router-dom';

import AppLayout from '../components/AppLayout';
import SendMessage from '../components/SendMessage';
import Header from '../components/Header';
import Sidebar from '../containers/Sidebar';
import MessageContainer from '../containers/MessageContainer';
import { allTeamsQuery } from '../graphql/Team';

const ViewTeam = ({
  data: { loading, allTeams, inviteTeams },
  match: {
    params: { teamId, channelId },
  },
}) => {
  if (loading) {
    return null;
  }

  const teams = [...allTeams, ...inviteTeams];

  if (!teams.length) {
    return <Redirect to="/create-team" />;
  }

  const teamIdInt = parseInt(teamId, 10);

  const teamIdx = teamIdInt ? findIndex(teams, ['id', teamIdInt]) : 0;
  const currentTeam = teamIdx === -1 ? teams[0] : teams[teamIdx];

  const channelIdInt = parseInt(channelId, 10);
  const channelIdx = channelIdInt
    ? findIndex(currentTeam.channels, ['id', channelIdInt])
    : 0;
  const currentChannel =
    channelIdx === -1
      ? currentTeam.channels[0]
      : currentTeam.channels[channelIdx];

  return (
    <AppLayout>
      <Sidebar
        teams={teams.map((team) => ({
          id: team.id,
          letter: team.name.charAt(0).toUpperCase(),
        }))}
        team={currentTeam}
      />
      {currentChannel && <Header channelName={currentChannel.name} />}
      {currentChannel && <MessageContainer channelId={currentChannel.id} />}
      {currentChannel && (
        <SendMessage
          channelName={currentChannel.name}
          channelId={currentChannel.id}
        >
          <input type="text" placeholder="send a message!" />
        </SendMessage>
      )}
    </AppLayout>
  );
};

export default graphql(allTeamsQuery)(ViewTeam);
