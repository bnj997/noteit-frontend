import {
  useCreateNoteMutation,
  CreateNoteMutationVariables,
  CreateNoteMutation,
  CreateNoteDocument,
} from "../../../generated/graphql";
import CategoryModalContainer from "./CategoryModalContainer";

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddNoteModal: React.FC<AddNoteModalProps> = ({ isOpen, onClose }) => {
  return (
    <CategoryModalContainer
      isOpen={isOpen}
      onClose={onClose}
      initialFormValue={{
        id: "",
        title: "",
        description: "",
        categories: [],
      }}
      heading={"Add Category"}
      buttonConfirm={"Create Category"}
      onFormSubmit={async (values, { resetForm }) => {
        resetForm();
        onClose();
      }}
    />
  );
};

export default AddNoteModal;
