import { Button, Flex, Link as UILink } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { MeDocument, MeQuery, useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { withApollo } from "../utils/withApollo";
import Link from "next/link";

const LoginSchema = Yup.object().shape({
  email: Yup.string().required("Please enter an email address"),
  password: Yup.string().required("Please enter a password"),
});

const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [login] = useLoginMutation();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "", password: "" }}
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
            <InputField
              name="email"
              placeholder="email"
              label="Email"
              type="email"
              touched={touched.email}
            />
            <InputField
              name="password"
              placeholder="password"
              label="Password"
              type="password"
              touched={touched.password}
            />
            <Flex mt={2}>
              <Link href="/forgot-password" passHref>
                <UILink ml={"auto"} color={"black"} mr={4}>
                  Forgot Password?
                </UILink>
              </Link>
            </Flex>

            <Button
              mt={4}
              isDisabled={!isValid}
              isLoading={isSubmitting}
              colorScheme="teal"
              type="submit"
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(Login);
