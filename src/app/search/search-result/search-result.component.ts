import { Component, OnInit, OnDestroy } from '@angular/core';
import { RecipesService } from 'src/app/recipes.service';
import { Recipe } from 'src/app/recipes.model';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/ingredient.model';
import { IngredientsService } from 'src/app/ingredients.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit, OnDestroy {
  // recipes: Recipe[];
  searchDefinedSubs: Subscription;
  searchCleanSubs: Subscription;
  isResult = false;
  isLoading = true;
  foundRecipes = [];
  showAllRecipes = false;
  allIngredients: Ingredient[];

  constructor(
    private recipesService: RecipesService,
    private ingredientsService: IngredientsService,
    private authService: AuthService,
    private router: Router,
    private searchService: SearchService) { }

  ngOnInit() {
    this.searchDefinedSubs = this.searchService.foundRecipesListener
      .subscribe(
        (recipesFound) => {
          this.isLoading = false;
          this.foundRecipes = recipesFound.recipes;
          this.isResult = recipesFound.isResult;
          this.showAllRecipes = !this.isResult;
        }
      );

    this.searchCleanSubs = this.searchService.searchCleaner
        .subscribe(
          () => {
            this.foundRecipes = [];
            this.isResult = false;
            this.isLoading = true;
          }
        );
  }

  ngOnDestroy() {
    this.searchDefinedSubs.unsubscribe();
    this.searchCleanSubs.unsubscribe();
  }
}
