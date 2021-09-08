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

  toggleAddChannelModal = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.setState((state) => ({
      openAddChannelModal: !state.openAddChannelModal,
    }));
  };

  toggleInviteModal = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.setState((state) => ({
      openInviteModal: !state.openInviteModal,
    }));
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
          onAddChannelClick={this.toggleAddChannelModal}
          onInvitePeopleClick={this.toggleInviteModal}
        />
        <AddChannelModal
          teamId={team.id}
          open={openAddChannelModal}
          onClose={this.toggleAddChannelModal}
        />
        ,
        <InviteModal
          teamId={team.id}
          open={openInviteModal}
          onClose={this.toggleInviteModal}
        />
      </>
    );
  }
}

export default Sidebar;
