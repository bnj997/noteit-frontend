import {
  useCreateNoteMutation,
  CreateNoteMutationVariables,
  CreateNoteMutation,
  CreateNoteDocument,
} from "../../../generated/graphql";
import NoteModalContainer from "./NoteModalContainer";

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddNoteModal: React.FC<AddNoteModalProps> = ({ isOpen, onClose }) => {
  const [createNote] = useCreateNoteMutation();

  return (
    <NoteModalContainer
      isOpen={isOpen}
      onClose={onClose}
      initialFormValue={{
        id: "",
        title: "",
        description: "",
        category: "",
      }}
      heading={"Add Note"}
      buttonConfirm={"Create Note"}
      onFormSubmit={async (values, { resetForm }) => {
        await createNote({
          variables: values as CreateNoteMutationVariables,
          update: (cache, { data }) => {
            cache.writeQuery<CreateNoteMutation>({
              query: CreateNoteDocument,
              data: {
                __typename: "Mutation",
                createNote: data!.createNote,
              },
            });
            cache.evict({ id: "ROOT_QUERY", fieldName: "notes" });
            cache.gc();
          },
        });
        resetForm();
        onClose();
      }}
    />
  );
};

export default AddNoteModal;
