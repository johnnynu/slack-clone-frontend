import React from 'react';
import _ from 'lodash';

import Channels from '../components/Channels';
import Teams from '../components/Teams';
import AddChannelModal from '../components/AddChannelModal';
import InviteModal from '../components/InviteModal';
import DirectMessageModal from '../components/DirectMessageModal';

class Sidebar extends React.Component {
  state = {
    openAddChannelModal: false,
    openInviteModal: false,
    openDirectMessageModal: false,
  };

  toggleDirectMessageModal = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.setState((state) => ({
      openDirectMessageModal: !state.openDirectMessageModal,
    }));
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
    const { teams, team, username } = this.props;
    const { openInviteModal, openAddChannelModal, openDirectMessageModal } =
      this.state;

    return (
      <>
        <Teams teams={teams} />
        <Channels
          teamName={team.name}
          username={username}
          teamId={team.id}
          channels={team.channels}
          users={team.directMessageMembers}
          onAddChannelClick={this.toggleAddChannelModal}
          onInvitePeopleClick={this.toggleInviteModal}
          onDirectMessageClick={this.toggleDirectMessageModal}
          isOwner={team.admin}
        />
        <DirectMessageModal
          teamId={team.id}
          open={openDirectMessageModal}
          onClose={this.toggleDirectMessageModal}
        />
        ,
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
