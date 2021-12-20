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
  Select,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import styled from "styled-components";
import Note from "../components/Note";
import {
  Note as NoteType,
  useMyNotesQuery,
  useDeleteNoteMutation,
} from "../generated/graphql";
import { ChangeEvent, useEffect, useState } from "react";
import { useSort } from "../utils/useSort";
import React from "react";
import { useRouter } from "next/router";
import ConfirmDeleteModal from "../components/modals/ConfirmDeleteModal";
import AddNoteModal from "../components/modals/notes/AddNoteModal";
import EditNoteModal from "../components/modals/notes/EditNoteModal";

const Index: NextPage = () => {
  const { data, loading } = useMyNotesQuery();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !data?.me) {
      router.push("/login");
    }
  }, [loading, data, router]);

  const [deleteNote] = useDeleteNoteMutation();
  const [noteId, setNoteId] = useState<string>("");

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();

  const {
    isOpen: isConfirmDeleteOpen,
    onOpen: onConfirmDeleteOpen,
    onClose: onConfirmDeleteClose,
  } = useDisclosure();

  /* SEARCH STUFF */

  const [filteredNotes, setFilteredNotes] = useState<NoteType[]>([]);
  const [filter, setFilter] = useState("");
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

      <EditNoteModal
        noteId={noteId}
        isOpen={isEditOpen}
        onClose={onEditClose}
      />

      <AddNoteModal
        userId={data?.me?.id}
        isOpen={isAddOpen}
        onClose={onAddClose}
      />

      <ConfirmDeleteModal
        isOpen={isConfirmDeleteOpen}
        onClose={onConfirmDeleteClose}
        item="note"
        onConfirm={async () => {
          await deleteNote({
            variables: { id: noteId },
            update: (cache) => {
              cache.evict({ id: "Note:" + noteId });
              cache.evict({ id: "User:" + data?.me?.id, fieldName: "notes" });
              cache.gc();
            },
          });

          onConfirmDeleteClose();
        }}
      />

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
          <Button
            colorScheme="teal"
            onClick={() => {
              onAddOpen();
            }}
          >
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
                onEditModalOpen={(id: string) => {
                  setNoteId(id);
                  onEditOpen();
                }}
                onDeleteModalOpen={(id: string) => {
                  setNoteId(id);
                  onConfirmDeleteOpen();
                }}
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

export default withApollo({ ssr: true })(Index);

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
