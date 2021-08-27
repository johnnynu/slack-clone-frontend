import React from 'react';

import AppLayout from '../components/AppLayout';
import Channels from '../components/Channels';
import Teams from '../components/Teams';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';
import Header from '../components/Header';

export default () => (
  <AppLayout>
    <Teams
      teams={[
        { id: 1, letter: 'C' },
        { id: 2, letter: 'S' },
      ]}
    />
    <Header channelName="general" />
    <Channels
      teamName="Team Name"
      username="Username"
      channels={[
        { id: 1, name: 'general' },
        { id: 2, name: 'random' },
      ]}
      users={[
        { id: 1, name: 'slackbot' },
        { id: 2, name: 'nonuser' },
      ]}
    />
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
