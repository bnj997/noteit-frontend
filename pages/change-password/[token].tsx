import { Box, Button, Flex, Link as UILink, Stack } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import React, { useState } from "react";
import { toErrorMap } from "../../utils/toErrorMap";
import * as Yup from "yup";
import { useRouter } from "next/router";
import {
  MeDocument,
  MeQuery,
  useChangePasswordMutation,
} from "../../generated/graphql";
import Link from "next/link";
import { withApollo } from "../../utils/withApollo";
import AuthForm from "../../components/AuthForm";
import PasswordInputField from "../../components/forms/PasswordInputField";

const ChangePasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters in length")
    .required("Please enter a password"),
  confirmNewPassword: Yup.string()
    .test("passwords-match", "Passwords must match", function (value) {
      return this.parent.newPassword === value;
    })
    .required("Please enter a password"),
});

const ChangePassword: NextPage = () => {
  const router = useRouter();
  const [changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");
  return (
    <AuthForm title="Change Password">
      <Formik
        initialValues={{ newPassword: "", confirmNewPassword: "" }}
        validationSchema={ChangePasswordSchema}
        onSubmit={async (values, { setErrors, resetForm }) => {
          const response = await changePassword({
            variables: {
              token:
                typeof router.query.token === "string"
                  ? router.query.token
                  : "",
              newPassword: values.confirmNewPassword,
            },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.changePassword.user,
                },
              });
            },
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            resetForm();
            router.push("/");
          }
        }}
      >
        {({ isSubmitting, touched, isValid }) => (
          <Form>
            <Stack spacing="6">
              <PasswordInputField
                label="New password"
                name="newPassword"
                showforgot={false}
                touched={touched.confirmNewPassword}
              />
              <PasswordInputField
                label="Confirm new password"
                name="confirmNewPassword"
                showforgot={false}
                touched={touched.confirmNewPassword}
              />
              {tokenError ? (
                <Flex>
                  <Box mr={2} style={{ color: "red" }}>
                    {tokenError}
                  </Box>
                  <Link href="/forgot-password" passHref>
                    <UILink>Click here to get a new one</UILink>
                  </Link>
                </Flex>
              ) : null}
              <Button
                mt={4}
                isDisabled={!isValid}
                isLoading={isSubmitting}
                colorScheme="teal"
                type="submit"
              >
                Change Password
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </AuthForm>
  );
};

export default withApollo({ ssr: false })(ChangePassword);
