import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login(
    $username: String!
    $password: String!
  ) {
    login(
      loginInput: {
        username: $username
        password: $password
      }
    ) {
      id
      email
      username
      token
    }
  }
`;
