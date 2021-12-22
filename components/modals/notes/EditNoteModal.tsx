import {
  useUpdateNoteMutation,
  useNoteQuery,
  UpdateNoteMutationVariables,
  UpdateNoteMutation,
  UpdateNoteDocument,
} from "../../../generated/graphql";
import { toErrorMap } from "../../../utils/toErrorMap";
import NoteModalContainer from "./NoteModalContainer";

interface EditNoteModalProps {
  noteId?: string;
  isOpen: boolean;
  onClose: () => void;
}

const EditNoteModal: React.FC<EditNoteModalProps> = ({
  noteId,
  onClose,
  isOpen,
}) => {
  const [updateNote] = useUpdateNoteMutation();

  const { data } = useNoteQuery({
    skip: noteId === "" || !isOpen,
    variables: {
      id: noteId!,
    },
  });

  return (
    <NoteModalContainer
      isOpen={isOpen}
      onClose={onClose}
      initialFormValue={{
        id: data?.note.note ? data.note.note!.id : "",
        title: data?.note.note ? data.note.note!.title : "",
        description: data?.note.note ? data.note.note!.description : "",
        category: data?.note.note ? data.note.note!.category : "",
      }}
      heading={"Edit Note"}
      buttonConfirm={"Confirm Change"}
      onFormSubmit={async (values, { setErrors, resetForm }) => {
        const response = await updateNote({
          variables: values as UpdateNoteMutationVariables,
          update: (cache, { data }) => {
            cache.writeQuery<UpdateNoteMutation>({
              query: UpdateNoteDocument,
              data: {
                __typename: "Mutation",
                updateNote: data!.updateNote,
              },
            });
            cache.evict({ id: "ROOT_QUERY", fieldName: "notes" });
            cache.gc();
          },
        });
        if (response.data?.updateNote.errors) {
          setErrors(toErrorMap(response.data.updateNote.errors));
        } else if (response.data?.updateNote.note) {
          resetForm();
          onClose();
        }
      }}
    />
  );
};

export default EditNoteModal;
