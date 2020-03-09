import { Component, OnInit, OnDestroy } from '@angular/core';
import { RecipesService } from '../recipes.service';
import { Recipe } from '../recipes.model';
import { Subscription } from 'rxjs';
import { IngredientsService } from '../ingredients.service';
import { Ingredient } from '../ingredient.model';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit, OnDestroy{
  recipes: Recipe[];
  recipesSubs: Subscription;
  ingredients: Ingredient[];
  searchText: string;

  constructor(private recipesService: RecipesService, private ingredientsService: IngredientsService) {}

  ngOnInit() {
    this.recipes = this.recipesService.getRecipes();
    this.recipesSubs = this.recipesService.recipesChanged.subscribe(
      (updatedRecipes: Recipe[]) => {
        this.recipes = updatedRecipes;
      });
    // se algum ingrediente mudar, atualiza o nome deste ingrediente nas receitas
    // this.ingredientsService.ingredientsChanged.subscribe(
    //   (updatedIngredients: Ingredient[]) => {
    //     for(let r of this.recipes) {
    //       for(let ing of r.ingredients) {
    //         for(let i of updatedIngredients) {
    //           if(ing.ingredient._id === i._id) {
    //             ing.ingredient.name = i.name;
    //           }
    //         }
    //       }
    //     }
    //   }
    // );
    console.log('receitas:', this.recipes);
  }

  onDeleteRecipe(id: string) {
    // console.log('recipe id:', id);
    this.recipesService.deleteRecipe(id);
  }

  findIngredientName(id: string) {
    return this.ingredientsService.findIngredientById(id);
  }

  ngOnDestroy() {
    this.recipesSubs.unsubscribe();
  }
}
