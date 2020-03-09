import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
// import { Observable } from 'rxjs';
import { IngredientsService } from 'src/app/ingredients.service';
import { RecipesService } from 'src/app/recipes.service';
import { Recipe } from 'src/app/recipes.model';
import { ActivatedRoute } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-recipe',
  templateUrl: './create-recipe.component.html',
  styleUrls: ['./create-recipe.component.css']
})
export class CreateRecipeComponent implements OnInit {
  createRecipeForm: FormGroup;
  ingredients = this.ingredientsService.getIngredients();
  editMode = false;
  paramsId: string;
  recipeToEdit: Recipe;
  ingredientsToEdit = new FormArray([]);
  restrictionsToEdit: FormGroup;
  Editor = ClassicEditor;
  editorData: string;

  constructor(
    private ingredientsService: IngredientsService,
    private recipesService: RecipesService,
    private route: ActivatedRoute,
    private _location: Location) { }

  ngOnInit() {
    this.paramsId = this.route.snapshot.params['id'];
    if (this.paramsId) {
      // console.log('paramsId = ',this.paramsId);
      this.editMode = true;
      this.recipeToEdit = this.recipesService.findRecipeById(this.paramsId);
      for(let i of this.recipeToEdit.ingredients) {
        this.ingredientsToEdit.push(
          new FormGroup({
            ingredient_id: new FormControl(i.ingredient_id),
            measure: new FormControl(i.measure),
            amount: new FormControl(i.amount),
            mode: new FormControl(i.ingredient_mode)
          })
        );
      }
      this.restrictionsToEdit = new FormGroup({
        vegan: new FormControl(this.recipeToEdit.restrictions.vegan),
        glutenFree: new FormControl(this.recipeToEdit.restrictions.glutenFree),
        noMilk: new FormControl(this.recipeToEdit.restrictions.noMilk)
      });

    }

    if (this.editMode) {
      // console.log('edit mode');
      // console.log('ingredientsToEdit: ', this.ingredientsToEdit);
      this.createRecipeForm = new FormGroup({
        title: new FormControl(this.recipeToEdit.title, Validators.required),
        // description: new FormControl(this.recipeToEdit.description, Validators.required),
        ingredients: this.ingredientsToEdit,
        typeOfRecipe: new FormControl(this.recipeToEdit.typeOfRecipe),
        restrictions: this.restrictionsToEdit,
        fromWhere: new FormControl(this.recipeToEdit.fromWhere),
        imagePath: new FormControl(this.recipeToEdit.imagePath),
      });
      this.editorData = this.recipeToEdit.description;
    } else {
      this.createRecipeForm = new FormGroup({
        title: new FormControl(null, Validators.required),
        // description: new FormControl('', Validators.required),
        ingredients: new FormArray([]),
        typeOfRecipe: new FormControl(null, Validators.required),
        restrictions: new FormGroup({
          vegan: new FormControl(false),
          glutenFree: new FormControl(false),
          noMilk: new FormControl(false)
        }),
        fromWhere: new FormControl(null, Validators.required),
        imagePath: new FormControl(null)
      });
      this.editorData = '';
    }
  }

  onEditorChange( { editor }: ChangeEvent ) {
    const data = editor.getData();
    this.editorData = data;
    // console.log( data );
  }

  onSubmit() {
    // console.log(this.createRecipeForm.value);
    // console.log(this.createRecipeForm.value['ingredients']);
    const ingredientsToSubmit = [];
    for(let i of this.createRecipeForm.value['ingredients']) {
      // console.log('ingredientToSubmit: ', i);
      ingredientsToSubmit.push({
        ingredient_id: i.ingredient_id,
        measure: i.measure,
        amount: +i.amount,
        ingredient_mode: i.mode
      });
    }
    if(this.editMode){
      this.recipeToEdit.title = this.createRecipeForm.controls.title.value;
      this.recipeToEdit.description = this.editorData;
      this.recipeToEdit.ingredients = ingredientsToSubmit;
      this.recipeToEdit.typeOfRecipe = this.createRecipeForm.controls.typeOfRecipe.value;
      this.recipeToEdit.restrictions = this.createRecipeForm.controls.restrictions.value;
      this.recipeToEdit.fromWhere = this.createRecipeForm.controls.fromWhere.value;
      this.recipeToEdit.imagePath = this.createRecipeForm.controls.imagePath.value;
      // console.log(
      //   'restricoes: ', this.createRecipeForm.controls.restrictions.value
      // );
      this.recipesService.updateRecipe(this.recipeToEdit);
    } else {
      const recipeToAdd: Recipe = {
        _id: '',
        title: this.createRecipeForm.value['title'],
        description: this.editorData,
        ingredients: ingredientsToSubmit,
        typeOfRecipe: this.createRecipeForm.value['typeOfRecipe'],
        restrictions: this.createRecipeForm.value['restrictions'],
        fromWhere: this.createRecipeForm.value['fromWhere'],
        imagePath: this.createRecipeForm.value['imagePath']
      };

      this.recipesService.addRecipe(recipeToAdd);
    }
  }

  onAddIngredient() {
    // console.log(this.createRecipeForm.get('ingredients').controls);
    (<FormArray>this.createRecipeForm.get('ingredients')).push(
      new FormGroup ({
        ingredient_id: new FormControl(),
        measure: new FormControl(),
        amount: new FormControl(),
        mode: new FormControl()
      })
    );
  }

  onSetRestrictions(input) {
    // console.log(input);
    if(input.target.checked){
      (<FormArray>this.createRecipeForm.get('restrictions')).push(
        new FormControl (input.target.value)
      );
    } else {
      const index = (<FormArray>this.createRecipeForm.get('restrictions')).value.findIndex(v => v===input.target.value);
      console.log('index: ', index);
      (<FormArray>this.createRecipeForm.get('restrictions')).removeAt(index);
    }
  }

  // containsRestriction(input) {
  //   const index = (<FormArray>this.createRecipeForm.get('restrictions')).value.findIndex(v => v===input.target.value)
  //   if(index >= 0) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  backClicked() {
    this._location.back();
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.createRecipeForm.get('ingredients')).removeAt(index);
  }
}
