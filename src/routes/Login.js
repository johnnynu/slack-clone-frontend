import React from 'react';
import { observer } from 'mobx-react';
import { extendObservable } from 'mobx';
import { Container, Header, Input, Button } from 'semantic-ui-react';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';

class Login extends React.Component {
  constructor(props) {
    super(props);

    extendObservable(this, {
      email: '',
      password: '',
    });
  }

  onChange = (e) => {
    const { name, value } = e.target;
    this[name] = value;
  };

  onSubmit = async () => {
    const { email, password } = this;
    const res = await this.props.mutate({
      variables: { email, password },
    });
    console.log(res);
    const { success, token, refreshToken } = res.data.login;

    if (success) {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
    }
  };

  render() {
    const { email, password } = this;

    return (
      <Container text>
        <Header as="h2">Login</Header>
        <Input
          name="email"
          onChange={this.onChange}
          value={email}
          fluid
          placeholder="email"
        />
        <Input
          name="password"
          onChange={this.onChange}
          value={password}
          type="password"
          fluid
          placeholder="password"
        />
        <Button onClick={this.onSubmit}>Submit</Button>
      </Container>
    );
  }
}

const loginMutation = gql`
  mutation ($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      success
      token
      refreshToken
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(loginMutation)(observer(Login));
