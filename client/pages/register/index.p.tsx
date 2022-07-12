import React from "react";
import { Formik, Field, FieldProps } from "formik";
import { Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import classnames from "classnames";
import { useDispatch } from "react-redux";
import { login } from "../../redux/authSlice";
import { REGISTER_USER } from "./gql/mutations";
import { RegisterFormValues, RegisterFormError } from "./types";
import initialValues from "./initialValues";
import styles from "./index.module.scss";

const { Input } = Form;

const Register: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [register, { loading, error }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: user } }) {
      dispatch(login(user));
      router.push("/");
    },
  });

  const errors = error?.graphQLErrors[0]?.extensions
    ?.errors as RegisterFormError;

  const handleSubmitForm = (formValues: RegisterFormValues): void => {
    register({ variables: formValues });
  };

  return (
    <div className={styles.formContainer}>
      <Formik initialValues={initialValues} onSubmit={handleSubmitForm}>
        {({ submitForm }) => (
          <Form noValidate className={classnames({ loading })}>
            <h1>Register</h1>
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
            <Field name="email">
              {({ field }: FieldProps) => (
                <Input
                  {...field}
                  label="Email"
                  type="email"
                  placeholder="Email..."
                  error={!!errors?.email}
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
            <Field name="confirmPassword">
              {({ field }: FieldProps) => (
                <Input
                  {...field}
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm Password..."
                  error={!!errors?.confirmPassword}
                />
              )}
            </Field>
            <Button type="submit" primary onClick={submitForm}>
              Register
            </Button>
          </Form>
        )}
      </Formik>
      {Object.keys((errors as {}) ?? {}).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.entries((errors as {}) ?? {}).map(([key, value]) => (
              <li key={key}>{value as string}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Register;
