import React from 'react';
import _ from 'lodash';
import decode from 'jwt-decode';

import Channels from '../components/Channels';
import Teams from '../components/Teams';
import AddChannelModal from '../components/AddChannelModal';
import InviteModal from '../components/InviteModal';

class Sidebar extends React.Component {
  state = {
    openAddChannelModal: false,
    openInviteModal: false,
  };

  handleCloseAddChannelModal = () => {
    this.setState({ openAddChannelModal: false });
  };

  handleAddChannelClick = () => {
    this.setState({ openAddChannelModal: true });
  };

  handleInviteClick = () => {
    this.setState({ openInviteModal: true });
  };

  handleCloseInviteModal = () => {
    this.setState({ openInviteModal: false });
  };

  render() {
    const { teams, team } = this.props;
    const { openInviteModal, openAddChannelModal } = this.state;

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
          onInvitePeopleClick={this.handleInviteClick}
        />
        <AddChannelModal
          teamId={team.id}
          open={openAddChannelModal}
          onClose={this.handleCloseAddChannelModal}
        />
        ,
        <InviteModal
          teamId={team.id}
          open={openInviteModal}
          onClose={this.handleCloseInviteModal}
        />
      </>
    );
  }
}

export default Sidebar;
