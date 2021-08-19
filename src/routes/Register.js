import React, { Component } from 'react';
import { Container, Header, Input, Button } from 'semantic-ui-react';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';

// eslint-disable-next-line react/prefer-stateless-function
class Register extends Component {
  state = {
    username: '',
    email: '',
    password: '',
  };

  onChange = (e) => {
    const { name, value } = e.target;
    // name = "email"
    this.setState({ [name]: value });
  };

  onSubmit = async () => {
    const res = await this.props.mutate({
      variables: this.state,
    });
    console.log(res);
  };

  render() {
    const { username, email, password } = this.state;
    return (
      <Container text>
        <Header as="h2">Register</Header>
        <Input
          name="username"
          onChange={this.onChange}
          value={username}
          fluid
          placeholder="username"
        />
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
          fluid
          placeholder="password"
        />
        <Button onClick={this.onSubmit}>Submit</Button>
      </Container>
    );
  }
}

const registerMutation = gql`
  mutation ($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password)
  }
`;

export default graphql(registerMutation)(Register);
