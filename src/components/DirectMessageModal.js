import React from 'react';
import Downshift from 'downshift';
import { Button, Form, Modal, Input } from 'semantic-ui-react';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import { withRouter } from 'react-router-dom';

function DirectMessageModal({
  history,
  open,
  onClose,
  teamId,
  data: { loading, getTeamMembers },
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>DM Users</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            {!loading && (
              <Downshift
                onChange={(selectedUser) => {
                  history.push(`/view-team/user/${teamId}/${selectedUser.id}`);
                  onClose();
                }}
              >
                {({
                  getInputProps,
                  getItemProps,
                  isOpen,
                  inputValue,
                  selectedItem,
                  highlightedIndex,
                }) => (
                  <div>
                    <Input
                      {...getInputProps({ placeholder: 'Favorite color ?' })}
                      fluid
                    />
                    {isOpen ? (
                      <div style={{ border: '1px solid #ccc' }}>
                        {getTeamMembers
                          .filter(
                            (i) =>
                              !inputValue ||
                              i.username
                                .toLowerCase()
                                .includes(inputValue.toLowerCase())
                          )
                          .map((item, index) => (
                            <div
                              {...getItemProps({ item })}
                              key={item.id}
                              style={{
                                backgroundColor:
                                  highlightedIndex === index ? 'gray' : 'white',
                                fontWeight:
                                  selectedItem === item ? 'bold' : 'normal',
                              }}
                            >
                              {item.username}
                            </div>
                          ))}
                      </div>
                    ) : null}
                  </div>
                )}
              </Downshift>
            )}
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose} color="black">
          Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

const getTeamMembersQuery = gql`
  query ($teamId: Int!) {
    getTeamMembers(teamId: $teamId) {
      id
      username
    }
  }
`;

export default withRouter(graphql(getTeamMembersQuery)(DirectMessageModal));
