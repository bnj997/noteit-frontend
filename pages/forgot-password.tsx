import { Box, Button, Stack } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React, { useState } from "react";
import InputField from "../components/InputField";
import { useForgotPasswordMutation } from "../generated/graphql";
import * as Yup from "yup";
import { withApollo } from "../utils/withApollo";
import AuthForm from "../components/AuthForm";

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Please enter an email address"),
});

const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();

  return (
    <AuthForm title="Forgot your password?" subtitle="We got you covered">
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
            <Box textAlign="center">We have sent an email to that address.</Box>
          ) : (
            <Form>
              <Stack spacing="6">
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
              </Stack>
            </Form>
          )
        }
      </Formik>
    </AuthForm>
  );
};

export default withApollo({ ssr: false })(ForgotPassword);
