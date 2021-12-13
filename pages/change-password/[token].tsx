import { Box, Button, Flex, Link as UILink } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import React, { useState } from "react";
import InputField from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
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

const ChangePasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters in length")
    .required("Please enter a password"),
});

const ChangePassword: NextPage = () => {
  const router = useRouter();
  const [changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        validationSchema={ChangePasswordSchema}
        onSubmit={async (values, { setErrors, resetForm }) => {
          const response = await changePassword({
            variables: {
              token:
                typeof router.query.token === "string"
                  ? router.query.token
                  : "",
              newPassword: values.newPassword,
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
            <InputField
              name="newPassword"
              placeholder="password"
              label="New Password"
              type="password"
              touched={touched.newPassword}
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
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(ChangePassword);
