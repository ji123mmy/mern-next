import React, { useState, useRef, LegacyRef } from "react";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps } from "next";
import { useQuery, useMutation } from "@apollo/client";
import { useSelector } from "react-redux";
import {
  Grid,
  Card,
  Image as SemanticImage,
  Button,
  Icon,
  Label,
  Transition,
  Form,
} from "semantic-ui-react";
import moment from "moment";
import client from "../../apollo-client";
import { RootState } from "../../redux/store";
import { FETCH_POSTS_ID, FETCH_POST, FETCH_POST_UPDATE } from "./gql/queries";
import { CREATE_COMMENT } from "./gql/mutations";
import { Post as IPost } from "../home/types";
import LikeButton from "../../components/LikeButton";
import DeleteButton from "../../components/DeleteButton";
import { Comment } from "../home/types";

const { Row, Column } = Grid;
const { Content, Header, Meta, Description } = Card;

interface Props {
  post: IPost;
}

const Post: React.FC<Props> = ({ post: postData }) => {
  const {
    query: { postId },
  } = useRouter();
  const [comment, setComment] = useState("");
  const { user } = useSelector((state: RootState) => state.auth);
  const { data } = useQuery(FETCH_POST_UPDATE, {
    variables: { postId },
  });
  const { getPost: updateData } = data ?? {};
  const commentInputRef = useRef<HTMLInputElement>(null);

  const [createComment, { loading }] = useMutation(CREATE_COMMENT, {
    variables: { postId, body: comment },
    update() {
      setComment("");
      commentInputRef.current?.blur();
    },
  });

  if (!postData) return <p>Loding...</p>;

  const { id, username, createdAt, body } = postData ?? {};

  const { likes, likeCount, comments, commentCount } = updateData ?? {};

  return (
    <Grid>
      <Row>
        <Column width={2}>
          <SemanticImage
            floated="right"
            size="small"
            float="right"
            src="https://react.semantic-ui.com/images/avatar/large/molly.png"
          />
        </Column>
        <Column width={10}>
          <Card fluid>
            <Content>
              <Header>{username}</Header>
              <Meta>{moment(createdAt).fromNow(true)}</Meta>
              <Description>{body}</Description>
            </Content>
            <hr />
            <Content extra>
              {likes && <LikeButton post={{ id, likes, likeCount }} />}
              <Button as="div" labelPosition="right">
                <Button color="blue" basic>
                  <Icon name="comments" />
                </Button>
                <Label as="a" basic color="blue" pointing="left">
                  {commentCount}
                </Label>
              </Button>
              {user && user.username === username && (
                <DeleteButton postId={id} isRedirectToHome />
              )}
            </Content>
          </Card>
          {user && (
            <Card fluid>
              <Content>
                <p>Post a comment</p>
                <Form>
                  <div className="ui action input fluid">
                    <input
                      ref={commentInputRef}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Comment..."
                    />
                    <Button
                      type="submit"
                      color="teal"
                      loading={loading}
                      disabled={comment.trim() === ""}
                      onClick={() => createComment()}
                    >
                      Submit
                    </Button>
                  </div>
                </Form>
              </Content>
            </Card>
          )}
          <Transition.Group>
            {comments?.map((comment: Comment) => (
              <Card fluid key={comment.id}>
                <Content>
                  <Header>{comment.username}</Header>
                  <Meta>{moment(comment.createdAt).fromNow(true)}</Meta>
                  <Description>{comment.body}</Description>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                </Content>
              </Card>
            ))}
          </Transition.Group>
        </Column>
      </Row>
    </Grid>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await client.query({ query: FETCH_POSTS_ID });
  const { getPosts: posts } = data;

  return {
    paths: posts.map((post: { id: string }) => ({
      params: {
        postId: post.id,
      },
    })),

    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { data } = await client.query({
    query: FETCH_POST,
    variables: { postId: params?.postId },
  });

  return {
    props: { post: data.getPost },

    revalidate: 1,
  };
};

export default Post;
