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
  useDisclosure,
} from "@chakra-ui/react";
import styled from "styled-components";
import Note from "../components/Note";
import {
  useDeleteNoteMutation,
  useNotesQuery,
  useMeQuery,
  Edges,
} from "../generated/graphql";
import { ChangeEvent, useEffect, useState } from "react";
import { useSort } from "../utils/useSort";
import React from "react";
import ConfirmDeleteModal from "../components/modals/ConfirmDeleteModal";
import AddNoteModal from "../components/modals/notes/AddNoteModal";
import EditNoteModal from "../components/modals/notes/EditNoteModal";
import { useRouter } from "next/router";
import AddCategoryModal from "../components/modals/categories/AddCategoryModal";

const Index: NextPage = () => {
  const router = useRouter();
  const { data: meData, loading: meLoading } = useMeQuery();

  useEffect(() => {
    if (!meData?.me) {
      router.push("/login");
    }
  }, [meData, router]);

  const { data, loading, error, fetchMore } = useNotesQuery({
    variables: {
      first: 8,
    },
    notifyOnNetworkStatusChange: true,
  });

  const hasNextPage = data?.notes?.pageInfo?.hasNextPage;
  const endCursor = data?.notes?.pageInfo?.endCursor;

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
    isOpen: isAddCatOpen,
    onOpen: onAddCatOpen,
    onClose: onAddCatClose,
  } = useDisclosure();

  const {
    isOpen: isConfirmDeleteOpen,
    onOpen: onConfirmDeleteOpen,
    onClose: onConfirmDeleteClose,
  } = useDisclosure();

  /* SEARCH STUFF */

  const [filteredNotes, setFilteredNotes] = useState<Edges[]>([]);
  const [filter, setFilter] = useState("");
  const { sortString, filterNotes } = useSort();

  useEffect(() => {
    if (!loading && meData?.me && data) {
      setFilteredNotes([...data!.notes!.edges]);
    }
  }, [loading, data, meData?.me]);

  const handleSeeMore = () => {
    setFilter("");
    const newNotes = filterNotes(filteredNotes, "");
    setFilteredNotes([...newNotes]);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
    const newNotes = filterNotes(data!.notes.edges, e.target.value);
    setFilteredNotes([...newNotes]);
  };

  if (!loading && !data) {
    return (
      <Box>
        <div>you got query failed for some reason</div>
        <div>{error?.message}</div>
      </Box>
    );
  }

  return (
    <Box bg="gray.50" position="absolute" top="0" right="0" bottom="0" left="0">
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

      <AddNoteModal isOpen={isAddOpen} onClose={onAddClose} />

      <AddCategoryModal isOpen={isAddCatOpen} onClose={onAddCatClose} />

      <ConfirmDeleteModal
        isOpen={isConfirmDeleteOpen}
        onClose={onConfirmDeleteClose}
        item="note"
        onConfirm={async () => {
          await deleteNote({
            variables: { id: noteId },
            update: (cache) => {
              cache.evict({ id: "Note:" + noteId });
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
            onChange={(e) => setFilteredNotes([...sortString(filteredNotes)])}
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
          <Button
            onClick={() => {
              onAddCatOpen();
            }}
          >
            Create Category
          </Button>
        </ButtonGroup>
      </SearchGrid>

      {filteredNotes.length > 0 ? (
        <NotesGrid>
          {filteredNotes.map(({ node }) => {
            return (
              <Note
                key={node.id}
                id={node.id}
                title={node.title}
                categories={node.categories}
                description={node.description}
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

      {hasNextPage ? (
        <Flex justifyContent="center">
          <Button
            colorScheme="teal"
            my="16"
            onClick={() => {
              fetchMore({
                variables: { after: endCursor },
              });
            }}
            isLoading={loading}
          >
            See more
          </Button>
        </Flex>
      ) : (
        <Flex justifyContent="center">
          <Text my="16"> You&apos;ve reached the end of the list</Text>
        </Flex>
      )}
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
