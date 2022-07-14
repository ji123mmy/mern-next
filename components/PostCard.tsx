import React from "react";
import {
  Card,
  Icon,
  Label,
  Image as SemanticImage,
  Button,
} from "semantic-ui-react";
import moment from "moment";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Post } from "../pages/home/types";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";

interface Props {
  post: Post;
}

const { Content, Header, Meta, Description } = Card;

const PostCard: React.FC<Props> = ({
  post: { id, body, likes, username, likeCount, commentCount, createdAt },
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  return (
    <Card fluid>
      <Content>
        <SemanticImage
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        <Header>{username}</Header>
        <Meta>
          <Link href={`/post/${id}`}>{moment(createdAt).fromNow(true)}</Link>
        </Meta>
        <Description>{body}</Description>
      </Content>
      <Content extra>
        <LikeButton post={{ id, likes, likeCount }} />
        <Button as="div" labelPosition="right">
          <Button color="blue" basic>
            <Icon name="comments" />
          </Button>
          <Label as="a" basic color="blue" pointing="left">
            {commentCount}
          </Label>
        </Button>
        {user && user.username === username && <DeleteButton postId={id} />}
      </Content>
    </Card>
  );
};

export default PostCard;
