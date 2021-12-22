import {
  Flex,
  Heading,
  Badge,
  ButtonGroup,
  Button,
  Text,
  Textarea,
} from "@chakra-ui/react";
import React from "react";
import styled from "styled-components";

interface NoteProps {
  id: string;
  title: string;
  category: string;
  description: string;
  onEditModalOpen: (id: string) => void;
  onDeleteModalOpen: (id: string) => void;
}

const Note: React.FC<NoteProps> = ({
  id,
  title,
  category,
  description,
  onEditModalOpen,
  onDeleteModalOpen,
}) => {
  return (
    <NoteCard>
      <Flex alignItems={"center"} p={3}>
        <Heading size="md">{title}</Heading>
        <Badge size="sm" ml="auto" p={2} borderRadius="full">
          {category}
        </Badge>
      </Flex>
      <Textarea
        rows={7}
        p={3}
        isReadOnly
        resize={"none"}
        value={description}
        overflow={"hidden"}
      />
      <Flex alignItems={"center"} p={3}>
        <ButtonGroup spacing="6" width="100%">
          <Button
            colorScheme="teal"
            width="100%"
            onClick={() => {
              onEditModalOpen(id);
            }}
          >
            Edit
          </Button>
          <Button
            width="100%"
            onClick={() => {
              onDeleteModalOpen(id);
            }}
          >
            Delete
          </Button>
        </ButtonGroup>
      </Flex>
    </NoteCard>
  );
};

export default Note;

const NoteCard = styled.div`
  display: flex;
  flex-direction: column;
  height: 350px;
  justify-content: space-between;
  padding: 1rem;
  border-radius: 10px;
  cursor: pointer;
  overflow: hidden;
  border: 3px solid rgba(249, 249, 249, 0.1);
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;

  &:hover {
    box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 12px;
    transform: scale(1.05);
    border-color: rgba(249, 249, 249, 0.8);
  }
`;
