import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from 'src/app/ingredient.model';
import { IngredientsService } from 'src/app/ingredients.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { RecipesService } from 'src/app/recipes.service';
import { forEach } from '@angular/router/src/utils/collection';
import { SearchService } from '../search.service';

export interface Fruit {
  name: string;
}

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  ingredients: Ingredient[] = [];
  // é necessário usar o ingredientsModified para manter o status de "check" dos ingredientes na lista durante a busca por outros ingredientes
  ingredientsModified: {ingredient: Ingredient, checkedStatus: boolean, numberOfRecipes: number}[] = [];
  searchIngredients: Ingredient[] = [];
  searchRestrictions = {noMilk: false, glutenFree: false, vegan: false};
  searchTypeOfRecipe = 'all';
  ingredientsSub: Subscription;
  recipesSub: Subscription;
  recipeCount: number;
  searchText = '';
  showFilters = false;

  // filteredIngredients: {ingredient: Ingredient, checked: boolean}[] = [];

  constructor(
    private ingredientsService: IngredientsService,
    private recipesService: RecipesService,
    private searchService: SearchService) { }


  ngOnInit() {

    this.ingredients = this.ingredientsService.getIngredients();
    for (let i of this.ingredients) {
      this.ingredientsModified.push({
        ingredient: i,
        checkedStatus: false,
        numberOfRecipes: this.recipesService.countRecipesForIngredient(i._id)
      });
    }
    // console.log(this.ingredients);
    // for(let ing of this.ingredients){
    //   this.filteredIngredients.push(
    //     {
    //       ingredient: ing,
    //       checked: false
    //     }
    //     );
    // }
    this.ingredientsSub = this.ingredientsService.ingredientsChanged.subscribe(
      (ingredientsUpdated: Ingredient[]) => {
        this.ingredients = ingredientsUpdated;
        this.ingredientsModified = [];
        for (let i of this.ingredients) {
          this.ingredientsModified.push({
            ingredient: i,
            checkedStatus: false,
            numberOfRecipes: this.recipesService.countRecipesForIngredient(i._id)
          });
        }
      }
    );

    this.recipeCount = this.recipesService.getRecipes().length;
    this.recipesSub = this.recipesService.recipesChanged.subscribe(
      (recipes) => {
        this.recipeCount = recipes.length;
      }
    );

    this.searchForm = new FormGroup({
      'ingredients': new FormControl(null)
    });
  }

  onSubmit() {
    // console.log(this.searchForm);
    this.searchService.defineSearch([...this.searchIngredients], this.searchRestrictions, this.searchTypeOfRecipe);
  }

  onToggleFilters() {
    if(this.showFilters) {
      this.showFilters = false;
    } else {
      this.showFilters = true;
    }
  }

  onSetRestrictionFilters(searchRestriction) {
    if(searchRestriction.target.checked) {
      this.searchRestrictions[searchRestriction.target.value] = true;
    } else {
      this.searchRestrictions[searchRestriction.target.value] = false;
    }
    // console.log('searchRestrictions: ', this.searchRestrictions);
  }

  onSetSearch(ingredientModified) {
    const ingredientId = ingredientModified.target.value;
    let ing;
    if(ingredientModified.target.checked){
      // console.log(ingredient.target.value);
      // console.log('ingrediente antes: ', this.ingredientsModified.find( s => s.ingredient._id === ingredientId));
      this.ingredientsModified.find( s => s.ingredient._id === ingredientId).checkedStatus = true;
      // console.log('ingrediente depois: ', this.ingredientsModified.find( s => s.ingredient._id === ingredientId));
      const ingredientAdd: Ingredient = this.ingredientsService.findIngredientById(ingredientId);
      // console.log(ingredientAdd);
      this.searchIngredients.push(ingredientAdd);
      // console.log(this.searchIngredients);
    } else if (!ingredientModified.target.checked) {
      this.ingredientsModified.find( s => s.ingredient._id === ingredientId).checkedStatus = false;
      for(let i=0; i<this.searchIngredients.length ; i++) {
        if (this.searchIngredients[i]._id === ingredientModified.target.value) {
          this.searchIngredients.splice(i, 1);
        }
      }
    }
  }

  onCleanSearch() {
    this.searchForm.reset();
    this.searchIngredients = [];
    for (let i of this.ingredientsModified) {
      i.checkedStatus = false;
    }
    this.searchTypeOfRecipe = 'all';
    this.searchRestrictions.vegan = false;
    this.searchRestrictions.noMilk = false;
    this.searchRestrictions.glutenFree = false;
    this.searchService.cleanSearch();
  }

  ngOnDestroy() {
    this.ingredientsSub.unsubscribe();
    this.recipesSub.unsubscribe();
  }


}
