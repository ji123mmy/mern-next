import { gql } from "@apollo/client";

export const FETCH_POSTS_ID =  gql`
query getPosts{
  getPosts {
    id
  }
}
`;

export const FETCH_POST = gql`
  query getPost($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      username
      createdAt
      comments {
        id
        body
        username
        createdAt
      }
      likes {
        username
      }
      likeCount
      commentCount
    }
  }
`;

export const FETCH_POST_UPDATE = gql`
  query getPost($postId: ID!) {
    getPost(postId: $postId) {
      id
      comments {
        id
        body
        username
        createdAt
      }
      likes {
        username
      }
      likeCount
      commentCount
    }
  }
`;
