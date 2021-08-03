import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, tap, take, exhaustMap } from "rxjs/operators";

import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";
import { AuthService } from "../auth/auth.service";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Ingredient } from "./ingredient.model";

@Injectable({ providedIn: "root" })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipesService: RecipeService,
    private authService: AuthService,
    private shoppingListService: ShoppingListService
  ) {}

  storeRecipes() {
    const recipes = this.recipesService.getRecipes();
    this.http
      .put(
        `https://ng-recipe-book-42315-default-rtdb.europe-west1.firebasedatabase.app/recipes/${this.authService.user["_value"].id}.json`,
        recipes
      )
      .subscribe((response) => {
        console.log(response);
      });
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>(
        `https://ng-recipe-book-42315-default-rtdb.europe-west1.firebasedatabase.app/recipes/${this.authService.user["_value"].id}.json`
      )
      .pipe(
        map((recipes) => {
          let recipesArray = [];
          if (recipes) {
            Object.keys(recipes).map((key) => {
              recipesArray.push(recipes[key]);
            });
          }
          return recipesArray.map((recipe) => {
            return {
              ingredients: [],
              ...recipe,
            };
          });
        }),
        tap((recipes) => {
          this.recipesService.setRecipes(recipes);
        })
      );
  }

  storeShoppingList() {
    const ingredients = this.shoppingListService.getIngredients();
    this.http
      .put(
        `https://ng-recipe-book-42315-default-rtdb.europe-west1.firebasedatabase.app/shoppingList/${this.authService.user["_value"].id}.json`,
        ingredients
      )
      .subscribe((response) => {
        console.log(response);
      });
  }

  fetchShoppingList() {
    return this.http
      .get<Ingredient[]>(
        `https://ng-recipe-book-42315-default-rtdb.europe-west1.firebasedatabase.app/shoppingList/${this.authService.user["_value"].id}.json`
      )
      .pipe(
        map((ingredients) => {
          let ingredientsArray = [];
          if (ingredients) {
            Object.keys(ingredients).map((key) => {
              ingredientsArray.push(ingredients[key]);
            });
          }
          return ingredientsArray.map((ingredient) => {
            return {
              ...ingredient,
            };
          });
        }),
        tap((ingredients) => {
          this.shoppingListService.setIngredients(ingredients);
        })
      );
  }
}
