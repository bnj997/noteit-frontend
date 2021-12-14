import { Button, Stack } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React from "react";
import InputField from "../components/InputField";
import { MeDocument, MeQuery, useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { withApollo } from "../utils/withApollo";
import PasswordInputField from "../components/PasswordInputField";
import AuthForm from "../components/AuthForm";

const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Please enter an email address"),
  password: Yup.string().required("Please enter a password"),
});

const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [login] = useLoginMutation();

  return (
    <AuthForm
      title="Sign in here"
      subtitle="Don't have an account yet?"
      link="register"
      linkTitle="Register here"
    >
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={async (values, { setErrors, resetForm }) => {
          const response = await login({
            variables: values,
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.login.user,
                },
              });
              cache.evict({ fieldName: "notes:{}" });
            },
          });
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            resetForm();
            router.push("/");
          }
        }}
      >
        {({ isSubmitting, touched, isValid }) => (
          <Form>
            <Stack spacing="6">
              <InputField
                name="username"
                placeholder="username"
                label="Username"
                required
                touched={touched.username}
              />
              <PasswordInputField
                name="password"
                touched={touched.password}
                showForgot={true}
              />
              <Button
                mt={4}
                size="lg"
                fontSize="md"
                isDisabled={!isValid}
                isLoading={isSubmitting}
                colorScheme="teal"
                type="submit"
              >
                Login
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </AuthForm>
  );
};

export default withApollo({ ssr: false })(Login);
