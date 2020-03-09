import { Ingredient } from '../ingredient.model';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Recipe } from '../recipes.model';
import { RecipesService } from '../recipes.service';

@Injectable({providedIn: 'root'})
export class SearchService {
  ingredientsFoundRecipes: Recipe[] = [];
  foundRecipesListener = new Subject<{recipes: Recipe[], isResult: boolean}>();
  isResult: boolean;
  showAll: boolean;
  searchCleaner = new Subject();

  constructor(private recipesService: RecipesService) {}

  defineSearch(ingredientsToSearch: Ingredient[], restrictions: {noMilk: boolean, glutenFree: boolean, vegan: boolean}, typeOfRecipe: string) {
    // this.recipes = this.recipesService.getRecipes();
    // console.log(this.recipes);
    // console.log(terms);
    let typeOfFoundRecipes: Recipe[] = [];
    let glutenFreeFoundRecipes: Recipe[] = [];
    let noMilkFoundRecipes: Recipe[] = [];
    let foundRecipesFinal: Recipe[] = [];

    if(ingredientsToSearch.length === 0) {
      // se não selecionou nenhum ingrediente para busca
      this.ingredientsFoundRecipes = this.recipesService.getRecipes();
      this.isResult = false;
    } else {
      this.ingredientsFoundRecipes = this.recipesService.getRecipesByIngredients(ingredientsToSearch);
      this.isResult = true;
    }

    if(typeOfRecipe != 'all') {
      for(let r of this.ingredientsFoundRecipes) {
        if(r.typeOfRecipe === typeOfRecipe) {
          typeOfFoundRecipes.push(r);
        }
      }
    } else {
      typeOfFoundRecipes = this.ingredientsFoundRecipes;
    }

    if(restrictions.noMilk) {
      for(let r of typeOfFoundRecipes) {
        if(r.restrictions.noMilk) {
          noMilkFoundRecipes.push(r);
        }
      }
    } else {
      noMilkFoundRecipes = typeOfFoundRecipes;
    }

    if(restrictions.glutenFree) {
      for(let r of typeOfFoundRecipes) {
        if(r.restrictions.glutenFree) {
          glutenFreeFoundRecipes.push(r);
        }
      }
    } else {
      glutenFreeFoundRecipes = noMilkFoundRecipes;
    }

    if(restrictions.vegan) {
      for(let r of typeOfFoundRecipes) {
        if(r.restrictions.vegan) {
          foundRecipesFinal.push(r);
        }
      }
    } else {
      foundRecipesFinal = glutenFreeFoundRecipes;
    }

    this.foundRecipesListener.next({recipes: [...foundRecipesFinal], isResult: this.isResult});
  }

  cleanSearch() {
    this.searchCleaner.next();
  }
}
