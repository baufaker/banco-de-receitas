import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';

import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { SearchBarComponent } from './search/search-bar/search-bar.component';
import { SearchResultComponent } from './search/search-result/search-result.component';
import {
  MatFormFieldModule,
  MatChipsModule,
  MatIconModule,
  MatButtonModule,
  MatNativeDateModule,
  MatCheckboxModule,
  MatSelectModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';


import { CreateRecipeComponent } from './recipe/create-recipe/create-recipe.component';
import { CreateIngredientComponent } from './ingredient/create-ingredient/create-ingredient.component';
import { HeaderComponent } from './header/header.component';
import { IngredientItemComponent } from './ingredient/ingredient-item/ingredient-item.component';
import { RecipesComponent } from './recipe/recipes.component';
import { IngredientsComponent } from './ingredient/ingredients/ingredients.component';
import { RecipePreviewComponent } from './recipe/recipe-preview/recipe-preview.component';
import { RecipeDetailComponent } from './recipe/recipe-detail/recipe-detail.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FilterPipe } from './filter.pipe';
import { FilterRecipesPipe } from './filter-recipes.pipe';
import { OrderByPipe } from './order-by.pipe';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
// import { AuthService } from './auth/auth.service';
// import { AuthGuard } from './auth/auth-guard.service';
import { AdminGuard } from './auth/admin-guard.service';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
  {path: 'recipes' , component: RecipesComponent, canActivate: [AdminGuard]},
  {path: 'recipes/new' , component: CreateRecipeComponent, canActivate: [AdminGuard]},
  {path: 'recipes/:id/edit' , component: CreateRecipeComponent, canActivate: [AdminGuard]},
  {path: 'recipes/:id' , component: RecipeDetailComponent},
  {path: 'ingredients' , component: IngredientsComponent, canActivate: [AdminGuard]},
  {path: 'ingredients/new' , component: CreateIngredientComponent, canActivate: [AdminGuard]},
  {path: 'ingredients/:id/edit' , component: CreateIngredientComponent, canActivate: [AdminGuard]},
  {path: 'auth/signup' , component: SignupComponent},
  {path: 'auth/login' , component: SigninComponent},
  {path: 'admin/dashboard' , component: AdminDashboardComponent, canActivate: [AdminGuard]},
  {path: '' , component: HomeComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    SearchBarComponent,
    SearchResultComponent,
    CreateRecipeComponent,
    CreateIngredientComponent,
    HeaderComponent,
    IngredientItemComponent,
    RecipesComponent,
    IngredientsComponent,
    RecipePreviewComponent,
    RecipeDetailComponent,
    FilterPipe,
    FilterRecipesPipe,
    OrderByPipe,
    SignupComponent,
    SigninComponent,
    AdminDashboardComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    MatFormFieldModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    CKEditorModule
  ],
  providers: [
    AdminGuard,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
