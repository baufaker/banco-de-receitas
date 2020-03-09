import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IngredientsService } from 'src/app/ingredients.service';
import { ActivatedRoute } from '@angular/router';
import { Ingredient } from 'src/app/ingredient.model';

@Component({
  selector: 'app-create-ingredient',
  templateUrl: './create-ingredient.component.html',
  styleUrls: ['./create-ingredient.component.css']
})
export class CreateIngredientComponent implements OnInit {
  newIngredientForm: FormGroup;
  editMode = false;
  paramsId: string;
  ingredientToEdit: Ingredient;
  // measures = ['ml', 'g', 'un.'];

  constructor(private ingredientsService: IngredientsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.paramsId = this.route.snapshot.params['id'];
    if (this.paramsId) {
      // console.log('paramsId = ',this.paramsId);
      this.editMode = true;
      this.ingredientToEdit = this.ingredientsService.findIngredientById(this.paramsId);
    }
    this.newIngredientForm = new FormGroup({
      name: new FormControl(null, Validators.required)
    });

    if (this.editMode) {
      this.newIngredientForm.setValue({
        name: this.ingredientToEdit.name
      });
    }
  }

  onSubmit() {
    if (!this.editMode) {
      if (this.checkNameExists(this.newIngredientForm.controls.name.value)) {
        alert('este ingrediente já existe');
      } else {
        this.ingredientsService.addIngredient(
          {
            _id: String(this.ingredientsService.countIngredients() + Math.random()),
            name: this.newIngredientForm.controls.name.value
          }
        );
      }
    } else {
      this.ingredientToEdit.name = this.newIngredientForm.controls.name.value;
      this.ingredientsService.updateIngredient(this.ingredientToEdit);
    }
  }

  checkNameExists(name: string) {
    return this.ingredientsService.checkNameExists(name);
  }
}
