import { Note } from "../generated/graphql";

export const useSort = () => {
  const sortString = (notes: Note[], type: string) => {
    if (type === "name") {
      let sorted = notes.sort(function (a, b) {
        var x = a.title.toLowerCase();
        var y = b.title.toLowerCase();
        if (x < y) {
          return -1;
        }
        if (x > y) {
          return 1;
        }
        return 0;
      });
      return sorted;
    } else {
      let sorted = notes.sort(function (a, b) {
        var x = a.category.toLowerCase();
        var y = b.category.toLowerCase();
        if (x < y) {
          return -1;
        }
        if (x > y) {
          return 1;
        }
        return 0;
      });
      return sorted;
    }
  };

  const filterNotes = (notes: Note[], filter: string) => {
    return notes.filter(function (note) {
      return note.title.toLowerCase().includes(filter.toLowerCase()) === true;
    });
  };

  return { sortString, filterNotes };
};
