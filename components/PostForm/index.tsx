import React from "react";
import { Formik, Field, FieldProps } from "formik";
import { Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import classnames from "classnames";
import { CREATE_POST } from "./gql/mutations";
import { FETCH_POSTS } from "../../pages/home/gql/queries";
import { Post } from "../../pages/home/types";
import { PostFormValuess } from "./types";
import initialValues from "./initialValues";
import styles from "./index.module.scss";

const { Input } = Form;

const PostForm: React.FC = () => {
  const [createPost, { loading, error, data }] = useMutation(CREATE_POST);

  const { createPost: newPost } = data ?? {};

  const handleSubmitForm = (formValues: PostFormValuess): void => {
    createPost({ variables: formValues });
  };

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={handleSubmitForm}>
        {({ submitForm }) => (
          <Form noValidate className={classnames({ loading })}>
            <h2>Creaete a Post:</h2>
            <Field name="body">
              {({ field }: FieldProps) => (
                <Input
                  {...field}
                  type="text"
                  error={!!error}
                  placeholder="Hi World!..."
                />
              )}
            </Field>
            <Button name="post" type="submit" primary onClick={submitForm}>
              {loading ? "Loading..." : "Post"}
            </Button>
          </Form>
        )}
      </Formik>
      {error && Object.keys((error as {}) ?? {}).length > 0 && (
        <div className={classnames("ui error message", styles.error)}>
          <ul className="list">
            <li>{error?.graphQLErrors[0]?.message}</li>
          </ul>
        </div>
      )}
      {newPost && (
        <div className={classnames("ui success message", styles.error)}>
          <ul className="list">
            <li> Post created!</li>
          </ul>
        </div>
      )}
    </>
  );
};

export default PostForm;
