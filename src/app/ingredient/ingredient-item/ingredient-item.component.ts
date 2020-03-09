import { Component, OnInit, Input } from '@angular/core';
import { Ingredient } from 'src/app/ingredient.model';
import { IngredientsService } from 'src/app/ingredients.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ingredient-item',
  templateUrl: './ingredient-item.component.html',
  styleUrls: ['./ingredient-item.component.css']
})
export class IngredientItemComponent implements OnInit {
  @Input() id: string;
  @Input() name: string;
  @Input() amount: number;
  @Input() measure: string;
  @Input() mode: string;
  ingredient: Ingredient;
  subs: Subscription;
  isLoading = true;

  constructor(private ingredientsService: IngredientsService) { }

  ngOnInit() {
    // aciona o ingredientsService só pra carregar os ingredientes vindos do backend.

    this.ingredientsService.getIngredients();
    this.subs = this.ingredientsService.ingredientsChanged.subscribe(
      () => {
        this.isLoading = false;
        this.ingredient = this.ingredientsService.findIngredientById(this.id);
      }
    );
  }
}
