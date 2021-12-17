import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Text,
  Heading,
  ButtonGroup,
} from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import { FocusableElement } from "@chakra-ui/utils";
import { useDeleteNoteMutation } from "../../generated/graphql";

interface ConfirmDeleteModalProps {
  noteId: string;
  isModalOpen: boolean;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  noteId,
  isModalOpen,
}) => {
  const [deleteNote] = useDeleteNoteMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    isModalOpen ? onOpen() : onClose();
  }, [isModalOpen, onOpen, onClose]);

  const handleConfirmDelete = async () => {
    await deleteNote({
      variables: { id: noteId },
      update: (cache) => {
        cache.evict({ id: "Note:" + noteId });
      },
    });
    onClose();
  };

  const initialRef = useRef<FocusableElement>(null);
  const finalRef = useRef<FocusableElement>(null);

  return (
    <Modal
      closeOnOverlayClick={false}
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      size="xl"
      isCentered
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading size="lg">Are you sure?</Heading>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={6}>
          <Text>
            Are you sure you want to delete this note? It will be gone forever.
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
            <Button mt={4} size="lg" fontSize="md" onClick={onClose}>
              Cancel
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmDeleteModal;
