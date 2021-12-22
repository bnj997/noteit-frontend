import { Edges } from "../generated/graphql";

export const useSort = () => {
  const sortString = (edges: Edges[], type: string) => {
    if (type === "name") {
      let sorted = edges.sort(function ({ node: a }, { node: b }) {
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
      let sorted = edges.sort(function ({ node: a }, { node: b }) {
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

  const filterNotes = (edges: Edges[], filter: string) => {
    return edges.filter(function ({ node }) {
      return node.title.toLowerCase().includes(filter.toLowerCase()) === true;
    });
  };

  return { sortString, filterNotes };
};
