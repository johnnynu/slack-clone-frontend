import React, { Component } from 'react';
import {
  Form,
  Container,
  Header,
  Input,
  Button,
  Message,
} from 'semantic-ui-react';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';

// eslint-disable-next-line react/prefer-stateless-function
class Register extends Component {
  state = {
    username: '',
    usernameError: '',
    email: '',
    emailError: '',
    password: '',
    passwordError: '',
  };

  onChange = (e) => {
    const { name, value } = e.target;
    // name = "email"
    this.setState({ [name]: value });
  };

  onSubmit = async () => {
    this.setState({
      usernameError: '',
      emailError: '',
      passwordError: '',
    });

    const { username, email, password } = this.state;
    const res = await this.props.mutate({
      variables: { username, email, password },
    });

    const { success, errors } = res.data.register;

    if (success) {
      this.props.history.push('/login');
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message;
        // err['passwordError'] = message
      });

      this.setState(err);
    }

    console.log(res);
  };

  render() {
    const {
      username,
      email,
      password,
      usernameError,
      emailError,
      passwordError,
    } = this.state;

    const errorList = [];

    if (usernameError) {
      errorList.push(usernameError);
    }

    if (emailError) {
      errorList.push(emailError);
    }

    if (passwordError) {
      errorList.push(passwordError);
    }

    return (
      <Container text>
        <Header as="h2">Register</Header>
        {errorList.length ? (
          <Message
            error
            header="There was some errors with your registration"
            list={errorList}
          />
        ) : null}
        <Form>
          <Form.Field error={!!usernameError}>
            <Input
              name="username"
              onChange={this.onChange}
              value={username}
              fluid
              placeholder="username"
            />
          </Form.Field>
          <Form.Field error={!!emailError}>
            <Input
              name="email"
              onChange={this.onChange}
              value={email}
              fluid
              placeholder="email"
            />
          </Form.Field>

          <Form.Field error={!!passwordError}>
            <Input
              name="password"
              onChange={this.onChange}
              value={password}
              type="password"
              fluid
              placeholder="password"
            />
          </Form.Field>
          <Button onClick={this.onSubmit}>Submit</Button>
        </Form>
      </Container>
    );
  }
}

const registerMutation = gql`
  mutation ($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      success
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(registerMutation)(Register);
