import { gql } from "@apollo/client";

export const POSTS_SUBSCRIPTION = gql`
  subscription newPost {
    newPost {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;
