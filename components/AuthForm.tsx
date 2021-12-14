import {
  Box,
  Heading,
  Text,
  useColorModeValue,
  Link as UILink,
} from "@chakra-ui/react";
import React from "react";
import Link from "next/link";
import { Card } from "./Card";

interface AuthFormProps {
  title: string;
  subtitle: string;
  link?: string;
  linkTitle?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({
  children,
  title,
  subtitle,
  link,
  linkTitle,
}) => {
  return (
    <Box
      bg={useColorModeValue("gray.50", "inherit")}
      minH="100vh"
      py="12"
      px={{ base: "4", lg: "8" }}
    >
      <Heading textAlign="center" size="xl" fontWeight="extrabold" mb="16">
        NoteIt
      </Heading>
      <Box maxW="md" mx="auto">
        <Heading textAlign="center" size="xl" fontWeight="extrabold">
          {title}
        </Heading>
        <Text mt="4" mb="8" align="center" maxW="md" fontWeight="medium">
          <Text as="span" mr={2}>
            {subtitle}
          </Text>
          <Link href={`/${link}`} passHref>
            <UILink ml={"auto"} color="teal" mr={4}>
              {linkTitle}
            </UILink>
          </Link>
        </Text>
        <Card>{children}</Card>
      </Box>
    </Box>
  );
};

export default AuthForm;
