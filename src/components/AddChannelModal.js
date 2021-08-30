import React from 'react';
import { Button, Form, Modal, Input } from 'semantic-ui-react';
import { withFormik } from 'formik';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import { flowRight as compose } from 'lodash';

function AddChannelModal({
  open,
  onClose,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Add Channel</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <Input
              fluid
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              name="name"
              placeholder="Channel name"
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
          content="Create Channel"
          labelPosition="right"
          icon="checkmark"
          positive
        />
      </Modal.Actions>
    </Modal>
  );
}

const createChannelMutation = gql`
  mutation ($teamId: Int!, $name: String!) {
    createChannel(teamId: $teamId, name: $name)
  }
`;

export default compose(
  graphql(createChannelMutation),
  withFormik({
    mapPropsToValues: () => ({ name: '' }),
    handleSubmit: async (
      values,
      { props: { onClose, teamId, mutate }, setSubmitting }
    ) => {
      await mutate({ variables: { teamId, name: values.name } });
      onClose();
      setSubmitting(false);
    },
  })
)(AddChannelModal);
