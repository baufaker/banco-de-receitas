import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Recipe } from 'src/app/recipes.model';
import { IngredientsService } from 'src/app/ingredients.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-preview',
  templateUrl: './recipe-preview.component.html',
  styleUrls: ['./recipe-preview.component.css']
})
export class RecipePreviewComponent implements OnInit, OnDestroy {
  @Input() recipe: Recipe;
  // ingredientsSub: Subscription;
  ingredientNames: string[] = [];

  constructor(
    private ingredientsService: IngredientsService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    for(let i of this.recipe.ingredients) {
      this.ingredientNames.push(
        (this.ingredientsService.findIngredientById(i.ingredient_id)).name
      );
    }

  }

  onRedirectUserToRecipe() {
    if(this.authService.getIsAuth()) {
      this.router.navigate(['recipes', this.recipe._id]);
    } else {
      alert('Faça seu login para usar o banco de receitas!');
    }
  }

  ngOnDestroy() {
    // this.ingredientsSub.unsubscribe();
  }

}
