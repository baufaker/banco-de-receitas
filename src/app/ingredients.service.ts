import { Injectable } from '@angular/core';
import { Ingredient } from './ingredient.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

const BACKEND_URL = 'http://localhost:3000/api';

@Injectable({providedIn: 'root'})
export class IngredientsService {
  ingredientsChanged = new Subject<Ingredient[]>();
  ingredientsLoaded = new Subject<Ingredient[]>();
  ingredients: Ingredient[] = [];
  // ingredientFound = new Subject<Ingredient>();
  // ingredients: Ingredient[] = [
  //   {_id: '1', name: 'molho'},
  //   {_id: '2', name: 'queijo'},
  //   {_id: '3', name: 'tomate'},
  //   {_id: '4', name: 'pão'},
  //   {_id: '5', name: 'espinafre'},
  //   {_id: '6', name: 'frango'},
  //   {_id: '7', name: 'beterraba'},
  //   {_id: '8', name: 'catupiry'},
  // ];

  constructor(private http: HttpClient, private router: Router) {}

  getIngredients() {
    // console.log('getIngredients()');
    this.http.get<{message: string, ingredients: Ingredient[]}>(BACKEND_URL + '/ingredients')
      .subscribe((ingredientData) => {
        // console.log('resposta get/ingredients: ', ingredientData);
        this.ingredients = ingredientData.ingredients;
        this.ingredientsChanged.next([...this.ingredients]);
        // for(let i of ingredientData.ingredients) {
        //   this.ingredients.push({
        //     name: i.name,
        //     _id: i._id
        //   });
        //   console.log('array de ingredientes: ', this.ingredients);
        // }
      });
    return [...this.ingredients];
  }

  addIngredient(ingredient: Ingredient) {
    this.http.post<{message: string, ingredient: Ingredient}>(BACKEND_URL + '/ingredients/create', ingredient).subscribe((ingredientAddResponse) => {
      // this.ingredients = this.getIngredients();
      this.ingredients.push({
        _id: ingredientAddResponse.ingredient._id,
        name: ingredientAddResponse.ingredient.name
      });
      this.ingredientsChanged.next([...this.ingredients]);
      // alert('ingrediente adicionado com sucesso.');
      this.router.navigate(['/ingredients']);
    });
  }

  removeIngredient(id: string) {
    this.http.delete(BACKEND_URL + '/ingredients/' + id).subscribe(
      (response) => {
        this.ingredients = this.getIngredients();
        this.ingredientsChanged.next([...this.ingredients]);
        this.router.navigate(['/ingredients']);
      }
    );
  }

  updateIngredient(ing: Ingredient) {
    this.http.put<{message: string}>(BACKEND_URL + '/ingredients/' + ing._id, ing).
      subscribe((ingredientUpdateResponse) => {
      this.ingredients = this.getIngredients();
        this.ingredientsChanged.next([...this.ingredients]);
        // alert('ingrediente adicionado com sucesso.');
        this.router.navigate(['/ingredients']);
    });
  }

  countIngredients() {
    return this.ingredients.length;
  }

  checkNameExists(name: string) {
    for(let i of this.ingredients) {
      if(i.name === name) {
        return true;
      }
    }
  }

  findIngredientName(id: string) {
    const i = this.ingredients.find(i => i._id === id);
    return i.name;
  }

  findIngredientById(id: string) {
    // console.log('id pra comparar:', id);
    // for(let i of this.ingredients) {
    //   // console.log('id do ingrediente:', i._id);
    //   if (id === i._id) {
    //     return i;
    //   }
    // }
    // console.log('chegou aqui');
    return this.ingredients.find(i => i._id === id);
  }

  // findIngredientByIdAsync(id: string){
  //     console.log('id pra comparar:', id);
  //     for(let i of this.ingredients) {
  //       console.log('id do ingrediente:', i._id);
  //       if (id === i._id) {
  //         this.ingredientFound.next(i);
  //       }
  //     }

  // }

  ingredientExists(name: string) {

    for(let i of this.ingredients) {
      if (name === i.name) {
        return true;
      }
    }
    return false;
  }
}
