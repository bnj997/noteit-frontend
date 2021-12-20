import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Heading,
  ButtonGroup,
} from "@chakra-ui/react";
import React, { useRef } from "react";
import { FocusableElement } from "@chakra-ui/utils";

interface ConfirmDeleteModalProps {
  item: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  item,
}) => {
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
            Are you sure you want to delete this {item}? It will be gone
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
              onClick={onConfirm}
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
