import React from 'react';
import { graphql } from '@apollo/client/react/hoc';
import _ from 'lodash';
import decode from 'jwt-decode';

import Channels from '../components/Channels';
import Teams from '../components/Teams';
import AddChannelModal from '../components/AddChannelModal';
import { allTeamsQuery } from '../graphql/Team';

class Sidebar extends React.Component {
  state = {
    openAddChannelModal: false,
  };

  handleCloseAddChannelModal = () => {
    this.setState({ openAddChannelModal: false });
  };

  handleAddChannelClick = () => {
    this.setState({ openAddChannelModal: true });
  };

  render() {
    const {
      data: { loading, allTeams },
      currentTeamId,
    } = this.props;
    if (loading) {
      return null;
    }

    const teamIdx = currentTeamId
      ? _.findIndex(allTeams, ['id', currentTeamId])
      : 0;
    const currentTeam = allTeams[teamIdx];

    let username = '';

    try {
      const token = localStorage.getItem('token');
      const { user } = decode(token);
      username = user.username;
    } catch (error) {
      console.log(error);
    }

    return loading ? null : (
      <>
        <Teams
          teams={allTeams.map((team) => ({
            id: team.id,
            letter: team.name.charAt(0).toUpperCase(),
          }))}
        />

        <Channels
          teamName={currentTeam.name}
          username={username}
          teamId={currentTeam.id}
          channels={currentTeam.channels}
          users={[
            { id: 1, name: 'slackbot' },
            { id: 2, name: 'nonuser' },
          ]}
          onAddChannelClick={this.handleAddChannelClick}
        />
        <AddChannelModal
          teamId={currentTeam.id}
          open={this.state.openAddChannelModal}
          onClose={this.handleCloseAddChannelModal}
        />
      </>
    );
  }
}

export default graphql(allTeamsQuery)(Sidebar);
