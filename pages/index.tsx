import type { NextPage } from "next";
import { withApollo } from "../utils/withApollo";
import NavBar from "../components/NavBar";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import styled from "styled-components";
import Note from "../components/Note";
import { Note as NoteType, useMyNotesQuery } from "../generated/graphql";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useSort } from "../utils/useSort";
import React from "react";
import { FocusableElement } from "@chakra-ui/utils";
import InputField from "../components/InputField";
import { Formik, Form } from "formik";

const Index: NextPage = () => {
  const { data, loading } = useMyNotesQuery();
  const [filteredNotes, setFilteredNotes] = useState<NoteType[]>([]);
  const [filter, setFilter] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [formState, setFormState] = useState<{
    title: string;
    description: string;
    category: string;
  }>({ title: "", description: "", category: "" });

  const initialRef = useRef<FocusableElement>(null);
  const finalRef = useRef<FocusableElement>(null);

  const { sortString, filterNotes } = useSort();

  useEffect(() => {
    if (!loading && data && data.me) {
      setFilteredNotes([...data?.me.notes]);
    }
  }, [loading, data]);

  const handleSeeMore = () => {
    setFilter("");
    const newNotes = filterNotes(filteredNotes, "");
    setFilteredNotes([...newNotes]);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
    const newNotes = filterNotes(data?.me?.notes, e.target.value);
    setFilteredNotes([...newNotes]);
  };

  const handleOpenModal = (noteInput: {
    title: string;
    description: string;
    category: string;
  }) => {
    setFormState(noteInput);
    onOpen();
  };

  return (
    <Box
      bg={useColorModeValue("gray.50", "inherit")}
      position="absolute"
      top="0"
      right="0"
      bottom="0"
      left="0"
    >
      <NavBar />
      <Heading
        fontSize={{ base: "1.75rem", md: "2.5rem" }}
        fontWeight="bold"
        color="black"
        textAlign={"center"}
        mt={16}
      >
        Search or create your own notes
      </Heading>

      <Modal
        closeOnOverlayClick={false}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        size="xl"
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit your note</ModalHeader>
          <ModalCloseButton />

          <Formik
            initialValues={formState}
            onSubmit={async (values, { setErrors, resetForm }) => {}}
          >
            {({ isSubmitting, touched, isValid }) => (
              <>
                <ModalBody pb={6}>
                  <Form>
                    <Stack spacing="6">
                      <InputField
                        name="title"
                        placeholder="title"
                        label="Title"
                        required
                        touched={touched.title}
                      />
                      <InputField
                        name="description"
                        placeholder="description"
                        label="Description"
                        required
                        touched={touched.description}
                      />
                    </Stack>
                  </Form>
                </ModalBody>
                <ModalFooter>
                  <Button
                    mt={4}
                    size="lg"
                    fontSize="md"
                    isDisabled={!isValid}
                    isLoading={isSubmitting}
                    colorScheme="teal"
                    type="submit"
                  >
                    Submit Changes
                  </Button>
                </ModalFooter>
              </>
            )}
          </Formik>
        </ModalContent>
      </Modal>

      <Flex justifyContent="center" alignItems="center" flexWrap="wrap">
        <Flex justifyContent="center" alignItems="center" m="2">
          <Text mr="2"> Manual: </Text>
          <Input
            w="300px"
            value={filter}
            onChange={(e) => {
              handleSearch(e);
            }}
            variant="outline"
            placeholder="eg. groceries list"
            my="10"
          />
        </Flex>
        <Flex justifyContent="center" alignItems="center" m="2">
          <Text mr="2"> Category: </Text>
          <Select
            w="300px"
            placeholder="Select option"
            onChange={(e) =>
              setFilteredNotes([...sortString(filteredNotes, e.target.value)])
            }
          >
            <option value="name">Name</option>
            <option value="category">Category</option>
          </Select>
        </Flex>
      </Flex>

      {filteredNotes.length > 0 ? (
        <NotesGrid>
          {filteredNotes.map((note) => {
            return (
              <Note
                key={note?.id}
                title={note?.title}
                category={note?.category}
                description={note?.description}
                onModalOpen={handleOpenModal}
              />
            );
          })}
        </NotesGrid>
      ) : (
        <Box textAlign="center" my="16">
          <Heading size="md">No results found. Please adjust filter</Heading>
        </Box>
      )}

      <Flex justifyContent="center">
        <Button colorScheme="teal" my="16" onClick={handleSeeMore}>
          See more
        </Button>
      </Flex>
    </Box>
  );
};

export default withApollo({ ssr: false })(Index);

const NotesGrid = styled.div`
  margin-top: 2rem;
  margin-left: auto;
  margin-right: auto;
  width: 70vw;
  display: grid;
  grid-gap: 3.5rem;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
`;

const SearchGrid = styled.div`
  margin-top: 2rem;
  margin-left: auto;
  margin-right: auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
`;
