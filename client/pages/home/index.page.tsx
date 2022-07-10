import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Grid, Transition } from "semantic-ui-react";
import { useSelector } from "react-redux";
import PostCard from "../../components/PostCard";
import PostForm from "../../components/PostForm";
import { FETCH_POSTS } from "./gql/queries";
import { Post } from "./types";
import { RootState } from "../../redux/store";
import styles from "./index.module.scss";

const { Row, Column } = Grid;

const Home: React.FC = () => {
  const { data, loading } = useQuery(FETCH_POSTS);
  const { user } = useSelector((state: RootState) => state.auth);
  const { getPosts: posts } = data ?? {};

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
