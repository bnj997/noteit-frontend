import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Stack,
  ModalFooter,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React, { useEffect, useRef, useState } from "react";
import InputField from "./InputField";
import { FocusableElement } from "@chakra-ui/utils";

interface NoteModalProps {
  heading: string;
  initialState: {
    title: string;
    description: string;
    category: string;
  };
  isModalOpen: boolean;
}

const NoteModal: React.FC<NoteModalProps> = ({
  heading,
  initialState,
  isModalOpen,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    isModalOpen ? onOpen() : onClose();
  }, [isModalOpen]);

  const initialRef = useRef<FocusableElement>(null);
  const finalRef = useRef<FocusableElement>(null);

  return (
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
        <ModalHeader>{heading}</ModalHeader>
        <ModalCloseButton />

        <Formik
          initialValues={initialState}
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
  );
};

export default NoteModal;
