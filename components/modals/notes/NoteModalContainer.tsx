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
  Heading,
  ButtonGroup,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React, { useRef } from "react";
import * as Yup from "yup";

import {
  CreateNoteMutationVariables,
  UpdateNoteMutationVariables,
} from "../../../generated/graphql";
import InputField from "../../InputField";
import TextareaField from "../../TextareaField";

interface NoteModalContainerProps {
  initialFormValue: CreateNoteMutationVariables | UpdateNoteMutationVariables;
  heading: string;
  buttonConfirm: string;
  onFormSubmit: (
    values: CreateNoteMutationVariables | UpdateNoteMutationVariables,
    { setErrors, resetForm }: { setErrors: any; resetForm: any }
  ) => Promise<void>;
  isOpen: boolean;
  onClose: () => void;
}

const NoteSchema = Yup.object().shape({
  title: Yup.string().required("Please enter a title"),
  description: Yup.string().required("Please enter a description"),
  category: Yup.string().required("Please enter a category"),
});

const NoteModalContainer: React.FC<NoteModalContainerProps> = ({
  initialFormValue,
  heading,
  buttonConfirm,
  onFormSubmit,
  isOpen,
  onClose,
}) => {
  const initialRef = useRef<HTMLInputElement>(null);
  const finalRef = useRef<HTMLInputElement>(null);

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
          <Heading size="lg">{heading}</Heading>
        </ModalHeader>
        <ModalCloseButton />

        <Formik
          initialValues={initialFormValue}
          enableReinitialize
          validationSchema={NoteSchema}
          onSubmit={onFormSubmit}
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
                    {buttonConfirm}
                  </Button>
                  <Button
                    mt={4}
                    size="lg"
                    fontSize="md"
                    isLoading={isSubmitting}
                    onClick={onClose}
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
  );
};

export default NoteModalContainer;
