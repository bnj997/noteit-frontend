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
  Checkbox,
  CheckboxGroup,
  HStack,
  FormLabel,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import React, { useRef } from "react";
import * as Yup from "yup";

import {
  CreateNoteMutationVariables,
  UpdateNoteMutationVariables,
  useCategoriesQuery,
} from "../../../generated/graphql";
import CheckboxField from "../../forms/CheckboxField";
import InputField from "../../forms/InputField";
import TextareaField from "../../forms/TextareaField";

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

  const { data, loading } = useCategoriesQuery({ skip: !isOpen });

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
                  <CheckboxField
                    name="categories"
                    checkBoxes={data?.categories ? data?.categories : []}
                    initialFilled={initialFormValue.categories}
                    label="Categories"
                    touched={touched.categories}
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
