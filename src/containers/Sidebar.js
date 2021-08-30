import React from 'react';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import _ from 'lodash';
import decode from 'jwt-decode';

import Channels from '../components/Channels';
import Teams from '../components/Teams';
import AddChannelModal from '../components/AddChannelModal';

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

    const teamIdx = _.findIndex(allTeams, ['id', currentTeamId]);
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
          channels={currentTeam.channels}
          users={[
            { id: 1, name: 'slackbot' },
            { id: 2, name: 'nonuser' },
          ]}
          onAddChannelClick={this.handleAddChannelClick}
        />
        <AddChannelModal
          teamId={currentTeamId}
          open={this.state.openAddChannelModal}
          onClose={this.handleCloseAddChannelModal}
        />
      </>
    );
  }
}

const allTeamsQuery = gql`
  {
    allTeams {
      id
      name
      channels {
        id
        name
      }
    }
  }
`;

export default graphql(allTeamsQuery)(Sidebar);
