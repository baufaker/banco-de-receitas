import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipesService } from 'src/app/recipes.service';
import { Recipe } from 'src/app/recipes.model';
import { IngredientsService } from 'src/app/ingredients.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  isLoading = true;

  constructor(private route: ActivatedRoute, private recipesService: RecipesService, private ingredientsService: IngredientsService, private _location: Location) { }

  ngOnInit() {
    // puxando as receitas direto do servidor pro caso de o usuário acessar a página da receita direto pela URL (ex: google). Nesse caso, sem passar pelos componentes principais do app, o usuário não teria a receita carregada.
    this.recipesService.getRecipesAsync()
      .subscribe(
        (recipesData) => {
          this.isLoading = false;
          this. recipe = recipesData.recipes.find(r => r._id === this.route.snapshot.params['id']);
        }
      );
  }

  getIngredientName(id:string) {
    return this.ingredientsService.findIngredientById(id).name;
  }

  backClicked() {
    this._location.back();
  }

}
