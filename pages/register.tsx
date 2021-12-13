import { Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { MeDocument, MeQuery, useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import * as Yup from "yup";
import Router from "next/router";
import { withApollo } from "../utils/withApollo";

interface registerProps {}

const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Please enter an email address"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters in length")
    .required("Please enter a password"),
});

const Register: React.FC<{}> = ({}) => {
  const [register] = useRegisterMutation();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "", password: "" }}
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
            Router.push("/");
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
            <Button
              mt={4}
              isDisabled={!isValid}
              isLoading={isSubmitting}
              colorScheme="teal"
              type="submit"
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(Register);
