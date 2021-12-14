import { Button, Stack } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React from "react";
import InputField from "../components/InputField";
import { MeDocument, MeQuery, useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { withApollo } from "../utils/withApollo";
import PasswordInputField from "../components/PasswordInputField";
import AuthForm from "../components/AuthForm";

interface registerProps {}

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(5, "Username must be at least 5 characters in length")
    .required("Please enter your username"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Please enter an email address"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters in length")
    .required("Please enter a password"),
  confirmPassword: Yup.string()
    .test("passwords-match", "Passwords must match", function (value) {
      return this.parent.password === value;
    })
    .required("Please enter a password"),
});

const Register: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [register] = useRegisterMutation();

  return (
    <AuthForm
      title="Register to use Noteit"
      subtitle="Already have an account"
      link="login"
      linkTitle="Sign in here"
    >
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={RegisterSchema}
        onSubmit={async (values, { setErrors, resetForm }) => {
          const response = await register({
            variables: values,
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.register.user,
                },
              });
              cache.evict({ fieldName: "notes:{}" });
            },
          });
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
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
              <InputField
                name="email"
                placeholder="email"
                label="Email"
                required
                touched={touched.email}
              />
              <PasswordInputField
                label="Password"
                name="password"
                touched={touched.password}
                showforgot={false}
              />
              <PasswordInputField
                label="Confirm password"
                name="confirmPassword"
                touched={touched.password}
                showforgot={false}
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

export default withApollo({ ssr: false })(Register);
