import { Component, OnInit } from '@angular/core';
import { RecipesService } from './recipes.service';
import { IngredientsService } from './ingredients.service';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'banco-de-receitas';
  constructor(
    private recipesService: RecipesService,
    private ingredientsService: IngredientsService,
    private authService: AuthService) {}

  ngOnInit() {
    // puxando as receitas e os ingredientes assim que o app inicia
    this.recipesService.getRecipes();
    this.ingredientsService.getIngredients();
    // sempre que o app reinicia, tenta manter o usuário logado
    this.authService.autoAuthUser();
    // this.recipesService.generateRecipes();
    // console.log(this.ingredientsService.getIngredients[0]);
  }
}
