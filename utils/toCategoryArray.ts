import { CategoriesOnNotes } from "../generated/graphql";

export const toCategoryArray = (categories: CategoriesOnNotes[]) => {
  const categoriesArray: Array<string> = [];
  categories.forEach(({ categoryId }, i) => {
    categoriesArray[i] = categoryId;
  });

  return categoriesArray;
};
