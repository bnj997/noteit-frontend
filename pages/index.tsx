import type { NextPage } from "next";
import { withApollo } from "../utils/withApollo";
import NavBar from "../components/NavBar";
import {
  Box,
  Button,
  ButtonGroup,
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
import {
  Note as NoteType,
  UpdateNoteDocument,
  UpdateNoteMutation,
  useMyNotesQuery,
  useDeleteNoteMutation,
  useUpdateNoteMutation,
  DeleteNoteMutation,
  DeleteNoteDocument,
} from "../generated/graphql";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useSort } from "../utils/useSort";
import React from "react";
import { FocusableElement } from "@chakra-ui/utils";
import * as Yup from "yup";
import InputField from "../components/InputField";
import { Formik, Form } from "formik";
import { toErrorMap } from "../utils/toErrorMap";
import TextareaField from "../components/TextareaField";
import { useApolloClient } from "@apollo/client";

const CreateNoteSchema = Yup.object().shape({
  title: Yup.string().required("Please enter a title"),
  description: Yup.string().required("Please enter a description"),
  category: Yup.string().required("Please enter a category"),
});

const Index: NextPage = () => {
  const { data, loading } = useMyNotesQuery();
  const [updateNote] = useUpdateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();
  const [filteredNotes, setFilteredNotes] = useState<NoteType[]>([]);
  const [filter, setFilter] = useState("");

  const client = useApolloClient();

  const [formState, setFormState] = useState<{
    id: string;
    title: string;
    description: string;
    category: string;
  }>({ id: "", title: "", description: "", category: "" });

  const [deleteNoteId, setDeleteNoteId] = useState<string>("");

  /* EDIT NOTE MODAL */
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

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
    id: string;
    title: string;
    description: string;
    category: string;
    deleteMode?: boolean;
  }) => {
    setFormState(noteInput);
    onEditOpen();
  };

  const handleDeleteModalOpen = (id: string) => {
    setDeleteNoteId(id);
    onDeleteOpen();
  };

  const handleConfirmDelete = async () => {
    await deleteNote({
      variables: { id: deleteNoteId },
      update: (cache, { data }) => {
        cache.writeQuery<DeleteNoteMutation>({
          query: DeleteNoteDocument,
          data: {
            __typename: "Mutation",
            deleteNote: data!.deleteNote,
          },
        });
        cache.evict({ fieldName: "notes:{}" });
      },
    });
    onDeleteClose();
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

      {/* EDIT MODAL*/}
      <Modal
        closeOnOverlayClick={false}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isEditOpen}
        size="xl"
        isCentered
        onClose={onEditClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg">Edit your note</Heading>
          </ModalHeader>
          <ModalCloseButton />

          <Formik
            initialValues={formState}
            validationSchema={CreateNoteSchema}
            onSubmit={async (values, { setErrors, resetForm }) => {
              const response = await updateNote({
                variables: values,
                update: (cache, { data }) => {
                  cache.writeQuery<UpdateNoteMutation>({
                    query: UpdateNoteDocument,
                    data: {
                      __typename: "Mutation",
                      updateNote: data!.updateNote,
                    },
                  });
                },
              });
              if (response.data?.updateNote.errors) {
                setErrors(toErrorMap(response.data.updateNote.errors));
              } else if (response.data?.updateNote.note) {
                resetForm();
                onEditClose();
              }
            }}
          >
            {({ isSubmitting, touched, isValid }) => (
              <Form>
                <ModalBody pb={6}>
                  <Stack spacing="6">
                    <InputField
                      refFocus={initialRef}
                      name="title"
                      placeholder="title"
                      label="Title"
                      required
                      touched={touched.title}
                    />
                    <TextareaField
                      name="description"
                      placeholder="description"
                      label="Description"
                      rows={10}
                      required
                      touched={touched.description}
                    />
                    <InputField
                      name="category"
                      placeholder="category"
                      label="Category"
                      required
                      touched={touched.category}
                    />
                  </Stack>
                </ModalBody>
                <ModalFooter>
                  <ButtonGroup spacing="6">
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
                    <Button
                      mt={4}
                      size="lg"
                      fontSize="md"
                      isDisabled={!isValid}
                      isLoading={isSubmitting}
                      onClick={() => onEditClose()}
                    >
                      Cancel
                    </Button>
                  </ButtonGroup>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>

      {/* CONFIRM DELETE MODAL*/}
      <Modal
        closeOnOverlayClick={false}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isDeleteOpen}
        size="xl"
        isCentered
        onClose={onDeleteClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg">Are you sure?</Heading>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6}>
            <Text>
              Are you sure you want to delete this note? It will be gone
              forever.
            </Text>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup spacing="6">
              <Button
                mt={4}
                size="lg"
                fontSize="md"
                colorScheme="teal"
                onClick={handleConfirmDelete}
              >
                Confirm Delete
              </Button>
              <Button mt={4} size="lg" fontSize="md" onClick={onDeleteClose}>
                Cancel
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <SearchGrid>
        <Flex justifyContent="center" alignItems="center">
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
        <Flex justifyContent="center" alignItems="center">
          <Text mr="2"> Category: </Text>
          <Select
            w="300px"
            placeholder="Select option"
            onChange={(e) =>
              setFilteredNotes([...sortString(filteredNotes, e.target.value)])
            }
            my="5"
          >
            <option value="name">Name</option>
            <option value="category">Category</option>
          </Select>
        </Flex>

        <ButtonGroup
          spacing="6"
          width="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Button colorScheme="teal" onClick={handleSeeMore}>
            Create Note
          </Button>
          <Button onClick={handleSeeMore}>Create Category</Button>
        </ButtonGroup>
      </SearchGrid>

      {filteredNotes.length > 0 ? (
        <NotesGrid>
          {filteredNotes.map((note) => {
            return (
              <Note
                key={note?.id}
                id={note?.id}
                title={note?.title}
                category={note?.category}
                description={note?.description}
                onModalOpen={handleOpenModal}
                onDeleteModalOpen={handleDeleteModalOpen}
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
  width: 70vw;
  margin-left: auto;
  margin-right: auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
`;
