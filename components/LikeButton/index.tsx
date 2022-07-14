import React, { useMemo } from "react";
import { Icon, Label, Button } from "semantic-ui-react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useMutation } from "@apollo/client";
import { RootState } from "../../redux/store";
import { Post } from "../../pages/home/types";
import { LIKE_POST } from "./gql/mutations";

type PostData = Pick<Post, "id" | "likes" | "likeCount">;

interface Props {
  post: PostData;
}

const LikeButton: React.FC<Props> = ({ post: { id, likes, likeCount } }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [likePost] = useMutation(LIKE_POST);
  const isUserliked = useMemo(
    () => likes.some((like) => like.username === user?.username),
    [likes, user]
  );

  const handleLike = () => {
    likePost({ variables: { postId: id } });
  };

  return (
    <Button as="div" labelPosition="right">
      {user ? (
        <Button color="teal" basic={!isUserliked} onClick={handleLike}>
          <Icon name="heart" />
        </Button>
      ) : (
        <Link href="/login">
          <Button color="teal" basic={!isUserliked} onClick={handleLike}>
            <Icon name="heart" />
          </Button>
        </Link>
      )}

      <Label as="a" basic color="teal" pointing="left">
        {likeCount}
      </Label>
    </Button>
  );
};

export default LikeButton;
