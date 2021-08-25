import React from 'react';

import AppLayout from '../components/AppLayout';
import Channels from '../components/Channels';
import Teams from '../components/Teams';
import Messages from '../components/Messages';
import Input from '../components/Input';
import Header from '../components/Header';

export default () => (
  <AppLayout>
    <Teams>Teams</Teams>
    <Channels>Channels</Channels>
    <Header className="header">Header</Header>
    <Messages className="messages">
      <ul className="message-list">
        <li />
        <li />
      </ul>
    </Messages>
    <Input>
      <input type="text" placeholder="send a message!" />
    </Input>
  </AppLayout>
);
