import { gql, useApolloClient } from "@apollo/client";
import {
  useUpdateNoteMutation,
  UpdateNoteMutationVariables,
  UpdateNoteMutation,
  UpdateNoteDocument,
} from "../../../generated/graphql";
import { toCategoryArray } from "../../../utils/toCategoryArray";
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
  const client = useApolloClient();
  const [updateNote] = useUpdateNoteMutation();

  const note = client.readFragment({
    id: "Note:" + noteId,
    fragment: gql`
      fragment MyNote on Note {
        id
        title
        description
        creatorId
        categories
      }
    `,
  });

  return (
    <NoteModalContainer
      isOpen={isOpen}
      onClose={onClose}
      initialFormValue={{
        id: note ? note.id : "",
        title: note ? note.title : "",
        description: note ? note.description : "",
        categories: note ? toCategoryArray(note.categories) : [],
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
