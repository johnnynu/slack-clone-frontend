import React from 'react';
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
    const { teams, team } = this.props;
    console.log(team.channels);

    let username = '';

    try {
      const token = localStorage.getItem('token');
      const { user } = decode(token);
      username = user.username;
    } catch (error) {
      console.log(error);
    }

    return (
      <>
        <Teams teams={teams} />

        <Channels
          teamName={team.name}
          username={username}
          teamId={team.id}
          channels={team.channels}
          users={[
            { id: 1, name: 'slackbot' },
            { id: 2, name: 'nonuser' },
          ]}
          onAddChannelClick={this.handleAddChannelClick}
        />
        <AddChannelModal
          teamId={team.id}
          open={this.state.openAddChannelModal}
          onClose={this.handleCloseAddChannelModal}
        />
      </>
    );
  }
}

export default Sidebar;
