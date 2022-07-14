import React, { useEffect } from "react";
import { useQuery, useSubscription } from "@apollo/client";
import { Grid, Transition } from "semantic-ui-react";
import { useSelector } from "react-redux";
import PostCard from "../../components/PostCard";
import PostForm from "../../components/PostForm";
import { FETCH_POSTS } from "./gql/queries";
import { POSTS_SUBSCRIPTION } from "./gql/subscriptions";
import { Post } from "./types";
import { RootState } from "../../redux/store";
import styles from "./index.module.scss";

const { Row, Column } = Grid;

const Home: React.FC = () => {
  const { data, loading, subscribeToMore } = useQuery(FETCH_POSTS);
  const { user } = useSelector((state: RootState) => state.auth);
  const { getPosts: posts } = data ?? {};

  useEffect(() => {
    subscribeToMore({
      document: POSTS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const { newPost } = subscriptionData.data;
        return {
          ...prev,
          getPosts: [newPost, ...prev.getPosts],
        };
      },
    });
  }, []);

  return (
    <Grid columns={3} divided>
      <Row className={styles.pageTitle}>
        <h1>Recent Posts</h1>
      </Row>
      <Row>
        {user && (
          <Column>
            <PostForm />
          </Column>
        )}
        {loading ? (
          <p>Loading Posts...</p>
        ) : (
          <Transition.Group>
            {posts &&
              posts.map((post: Post) => (
                <Column key={post.id} style={{ marginBottom: 20 }}>
                  <PostCard post={post} />
                </Column>
              ))}
          </Transition.Group>
        )}
      </Row>
    </Grid>
  );
};

export default Home;
