import React from 'react';
import { Button, Form, Modal, Input } from 'semantic-ui-react';
import { withFormik } from 'formik';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import { flowRight as compose } from 'lodash';

import normalizeErrors from '../normalizeErrors';

function InviteModal({
  open,
  onClose,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  touched,
  errors,
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Invite People to Your Team</Modal.Header>
      {touched.email && errors.email ? errors.email[0] : null}
      <Modal.Content>
        <Form>
          <Form.Field>
            <Input
              fluid
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              name="email"
              placeholder="Email to invite"
            />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button disabled={isSubmitting} onClick={onClose} color="black">
          Cancel
        </Button>
        <Button
          disabled={isSubmitting}
          onClick={handleSubmit}
          content="Invite"
          labelPosition="right"
          icon="checkmark"
          positive
        />
      </Modal.Actions>
    </Modal>
  );
}

const addTeamMemberMutation = gql`
  mutation ($email: String!, $teamId: Int!) {
    addTeamMember(email: $email, teamId: $teamId) {
      success
      errors {
        path
        message
      }
    }
  }
`;

export default compose(
  graphql(addTeamMemberMutation),
  withFormik({
    mapPropsToValues: () => ({ email: '' }),
    handleSubmit: async (
      values,
      { props: { onClose, teamId, mutate }, setSubmitting, setErrors }
    ) => {
      const response = await mutate({
        variables: { email: values.email, teamId },
      });
      const { success, errors } = response.data.addTeamMember;
      if (success) {
        onClose();
        setSubmitting(false);
      } else {
        setSubmitting(false);
        setErrors(normalizeErrors(errors));
      }
    },
  })
)(InviteModal);
