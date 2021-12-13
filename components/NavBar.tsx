import { useApolloClient } from "@apollo/client";
import { Box, Button, Flex, Link as UILink } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
  const { data, loading } = useMeQuery();
  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  const apolloClient = useApolloClient();
  let body = null;

  if (loading) {
    body = null;
  } else if (!data?.me) {
    body = (
      <>
        <Link href="/login" passHref>
          <UILink color={"white"} mr={4}>
            login
          </UILink>
        </Link>
        <Link href="/register" passHref>
          <UILink color={"white"}> register</UILink>
        </Link>
      </>
    );
  } else {
    body = (
      <Flex>
        <Box mr={2}>{data.me.email}</Box>
        <Button
          color={"white"}
          variant="link"
          onClick={async () => {
            await logout();
            await apolloClient.resetStore();
          }}
          isLoading={logoutFetching}
        >
          logout
        </Button>
      </Flex>
    );
  }
  return (
    <Box bg="tomato" p={4}>
      <Flex w={"70vw"} ml={"auto"} mr={"auto"}>
        <Box color={"white"} ml={"auto"}>
          {body}
        </Box>
      </Flex>
    </Box>
  );
};

export default NavBar;
