import { Injectable, OnInit } from '@angular/core';
import { Recipe } from './recipes.model';
// import { Ingredient } from './ingredient.model';
import { Router } from '@angular/router';
import { IngredientsService } from './ingredients.service';
import { Ingredient } from './ingredient.model';
import { Subject, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth/auth.service';

const BACKEND_URL = 'http://localhost:3000/api';

@Injectable({providedIn: 'root'})
export class RecipesService {
  recipesChanged = new Subject<Recipe[]>();
  recipesCounter = new Subject<number>();
  ingredientsSub: Subscription;
  recipesSearchResult: Recipe[] = [];
  recipes: Recipe[] = [];


  constructor(
    private router: Router,
    private ingredientsService: IngredientsService,
    private http: HttpClient,
    private authService: AuthService) {}

    // ngOnInit() {
    //   this.ingredientsSub = this.ingredientsService.ingredientsChanged.subscribe(
    //     () => {
    //       this.recipesChanged.next([...this.recipes]);
    //     }
    //   );
    // }

  getRecipes() {
    this.http.get<{message: string, recipes: Recipe[]}>(BACKEND_URL + '/recipes')
    .subscribe((recipeData) => {
      this.recipes = recipeData.recipes;
      this.recipesChanged.next([...this.recipes]);
      this.recipesCounter.next(this.recipes.length);
    });
    return [...this.recipes];
  }

  getRecipesAsync() {
    return this.http.get<{message: string, recipes: Recipe[]}>(BACKEND_URL + '/recipes');
  }

  updateRecipe(rec: Recipe) {
    console.log('receita que chegou no service para update: ', rec);
    this.http.put<{message: string}>(BACKEND_URL + '/recipes/' + rec._id, rec).
      subscribe((ingredientUpdateResponse) => {
      this.recipes = this.getRecipes();
      this.router.navigate(['/recipes']);
    });
  }

  findRecipeById(id: string) {
    for(let r of this.recipes) {
      if (id === r._id) {
        return r;
      }
    }
  }

  getRecipesByIngredients(ingredientsSearch: Ingredient[]): Recipe[] {
    // console.log(ingredientsSearch);
    this.recipesSearchResult = [];
    // console.log(ingredients);
    for(let r of this.recipes) {
      // console.log('receita: ', r);
      let count = 0;
      for (let ing of ingredientsSearch) {
        for(let i of r.ingredients) {
          // console.log('ingrediente: ' + i.ingredient.name + ', da receita: ' + ing);
          if(i.ingredient_id === ing._id) {
            count+=1;
            // console.log('DEU MATCH. count: ', count);
          }
        }
        // se achou todos os ingredientes da busca na receita
        if(count === ingredientsSearch.length){

          this.recipesSearchResult.push(r);
        }
      }
    }
    // console.log(this.recipesSearchResult);
    return [...this.recipesSearchResult];
  }

  addRecipe(recipe: Recipe) {
    console.log('receita para adicionar:', recipe);
    this.http.post(BACKEND_URL + '/recipes/create', recipe).subscribe(
      (response) => {
        console.log(response);
        this.recipes.push(recipe);
        // console.log('after recipe added: ', this.recipes);
        this.recipesChanged.next([...this.recipes]);
        this.router.navigate(['/recipes']);
      }
    );
  }

  deleteRecipe(id: string) {
    this.http.delete(BACKEND_URL + '/recipes/' + id).subscribe(
      (response) => {
        this.recipes = this.getRecipes();
        this.router.navigate(['/recipes']);
      }
    );
  }

  countRecipesForIngredient(ingredient_id: string) {
    let counter = 0;
    for (let r of this.recipes) {
      for (let i of r.ingredients) {
        if (i.ingredient_id === ingredient_id) {
          counter ++;
        }
      }
    }
    return counter;
  }
}
