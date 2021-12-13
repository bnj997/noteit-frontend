import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import router from "next/router";
import React, { useState } from "react";
import * as Yup from "yup";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import {
  MeQuery,
  MeDocument,
  useForgotPasswordMutation,
} from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { withApollo } from "../utils/withApollo";
import login from "./login";

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Please enter an email address"),
});

const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "" }}
        validationSchema={ForgotPasswordSchema}
        onSubmit={async (values) => {
          await forgotPassword({
            variables: {
              email: values.email,
            },
          });
          setComplete(true);
        }}
      >
        {({ isSubmitting, touched, isValid }) =>
          complete ? (
            <Box>We have sent an email to that address</Box>
          ) : (
            <Form>
              <InputField
                name="email"
                placeholder="email"
                label="Email"
                type="email"
                touched={touched.email}
              />
              <Button
                mt={4}
                isDisabled={!isValid}
                isLoading={isSubmitting}
                colorScheme="teal"
                type="submit"
              >
                Confirm Email
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(ForgotPassword);
