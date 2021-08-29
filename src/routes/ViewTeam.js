import React from 'react';

import AppLayout from '../components/AppLayout';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';
import Header from '../components/Header';
import Sidebar from '../containers/Sidebar';

export default () => (
  <AppLayout>
    <Sidebar currentTeamId={26} />
    <Header channelName="general" />
    <Messages className="messages">
      <ul className="message-list">
        <li />
        <li />
      </ul>
    </Messages>
    <SendMessage channelName="general">
      <input type="text" placeholder="send a message!" />
    </SendMessage>
  </AppLayout>
);
