import { gql } from '@apollo/client';

export const getUserQuery = gql`
  {
    getUser {
      id
      username

      teams {
        id
        name
        admin
        directMessageMembers {
          id
          username
        }
        channels {
          id
          name
        }
      }
    }
  }
`;
