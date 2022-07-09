import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button, Icon, Confirm } from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import { DELETE_POST, DELETE_COMMENT } from "./gql/mutations";
import { FETCH_POSTS } from "../../pages/home/gql/queries";

interface Props {
  postId: string;
  commentId?: string;
  isRedirectToHome?: boolean;
}

const DeleteButton: React.FC<Props> = ({
  postId,
  commentId,
  isRedirectToHome = false,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const router = useRouter();
  const [deletePost, { loading: postLoading }] = useMutation(DELETE_POST, {
    update(caches) {
      const data = caches.readQuery({ query: FETCH_POSTS }) as {
        getPosts: any[];
      };
      caches.writeQuery({
        query: FETCH_POSTS,
        data: {
          getPosts: data.getPosts.filter((post) => post.id !== postId),
        },
      });
    },
  });
  const [deleteComment, { loading: commentLoading }] =
    useMutation(DELETE_COMMENT);

  const handleDelete = () => {
    commentId
      ? deleteComment({ variables: { postId, commentId } })
      : deletePost({ variables: { postId } });
    setConfirmOpen(false);
    if (isRedirectToHome) {
      router.push("/home");
    }
  };
  return (
    <>
      <Button
        as="div"
        color="red"
        floated="right"
        loading={postLoading || commentLoading}
        onClick={() => setConfirmOpen(true)}
      >
        <Icon name="trash" style={{ margin: 0 }} />
      </Button>
      <Confirm
        content={`Are you sure you want to delete this ${
          commentId ? "comment" : "post"
        }?`}
        open={confirmOpen}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
};

export default DeleteButton;
