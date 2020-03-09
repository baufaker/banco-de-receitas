import { Component, OnInit, OnDestroy } from '@angular/core';
import { IngredientsService } from 'src/app/ingredients.service';
import { Ingredient } from 'src/app/ingredient.model';
import { Subscription } from 'rxjs';
import { RecipesService } from 'src/app/recipes.service';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.css']
})
export class IngredientsComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  ingredientsSub: Subscription;
  searchText: string;

  constructor(private ingredientsService: IngredientsService, private recipesService: RecipesService) { }

  ngOnInit() {
    this.ingredients = this.ingredientsService.getIngredients();
    this.ingredientsSub = this.ingredientsService.ingredientsChanged.subscribe(
      (ingredientsUpdated: Ingredient[]) => {
        this.ingredients = ingredientsUpdated;
      }
    );
  }

  onDeleteIngredient(id: string) {
    const recipes = this.recipesService.getRecipes();
    let isUsed = false;
    for(let r of recipes) {
      for (let i of r.ingredients) {
        if (i.ingredient_id === id) {
          isUsed = true;
        }
      }
    }

    if(isUsed) {
      alert('Ingrediente está sendo usado em uma ou mais receitas. Para deletá-lo, primeiro delete ou edite as receitas que o utilizam.');
    } else {
      this.ingredientsService.removeIngredient(id);
    }

  }

  ngOnDestroy() {
    this.ingredientsSub.unsubscribe();
  }
}
