import { gql } from "@apollo/client";

export const FETCH_POSTS = gql`
  query getPosts {
    getPosts {
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
