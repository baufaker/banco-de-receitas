import { Ingredient } from './ingredient.model';

export interface Recipe {
  _id: string,
  title: string,
  description: string,
  ingredients: {ingredient_id: string, measure: string, amount: number, ingredient_mode: string}[],
  typeOfRecipe: string,
  restrictions: {vegan: boolean, glutenFree: boolean, noMilk: boolean},
  fromWhere: string,
  imagePath: string,
}
