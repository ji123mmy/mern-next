import React from "react";
import { Formik, Field, FieldProps } from "formik";
import { useDispatch } from "react-redux";
import { Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import classnames from "classnames";
import { LOGIN_USER } from "./gql/mutations";
import { LoginFormValues, LoginFormError } from "./types";
import initialValues from "./initialValues";
import { login } from "../../redux/authSlice";
import styles from "./index.module.scss";

const { Input } = Form;

const Login: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [userLogin, { loading, error }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: user } }) {
      dispatch(login(user));
      router.push("/home");
    },
  });

  const errors =
    (error?.graphQLErrors[0]?.extensions?.errors as LoginFormError) ??
    (error?.graphQLErrors[0].message as string);

  const handleSubmitForm = (formValues: LoginFormValues): void => {
    userLogin({ variables: formValues });
  };

  return (
    <div className={styles.formContainer}>
      <Formik initialValues={initialValues} onSubmit={handleSubmitForm}>
        {({ submitForm }) => (
          <Form noValidate className={classnames({ loading })}>
            <h1>Login</h1>
            <Field name="username">
              {({ field }: FieldProps) => (
                <Input
                  {...field}
                  label="Username"
                  type="text"
                  placeholder="Username..."
                  error={!!errors?.username}
                />
              )}
            </Field>
            <Field name="password">
              {({ field }: FieldProps) => (
                <Input
                  {...field}
                  label="Password"
                  type="password"
                  placeholder="Password..."
                  error={!!errors?.password}
                />
              )}
            </Field>
            <Button type="submit" primary onClick={submitForm}>
              Login
            </Button>
          </Form>
        )}
      </Formik>
      {typeof errors === "string" ? (
        <div className="ui error message">{errors}</div>
      ) : (
        Object.keys((errors as {}) ?? {}).length > 0 && (
          <div className="ui error message">
            <ul className="list">
              {Object.entries((errors as {}) ?? {}).map(([key, value]) => (
                <li key={key}>{value as string}</li>
              ))}
            </ul>
          </div>
        )
      )}
    </div>
  );
};

export default Login;
