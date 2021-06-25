import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, tap, take, exhaustMap } from "rxjs/operators";

import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";
import { AuthService } from "../auth/auth.service";

@Injectable({providedIn: 'root'})
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipesService: RecipeService,
    private authService: AuthService
  ) {}

  storeRecipes() {
    const recipes = this.recipesService.getRecipes();
    this.http
      .put(`https://ng-recipe-book-42315-default-rtdb.europe-west1.firebasedatabase.app/recipes/${this.authService.user["_value"].id}.json`, recipes)
      .subscribe(response => {
        console.log(response)
      });
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>(
        //`https://ng-recipe-book-42315-default-rtdb.europe-west1.firebasedatabase.app/recipes.json`,
        `https://ng-recipe-book-42315-default-rtdb.europe-west1.firebasedatabase.app/recipes/${this.authService.user["_value"].id}.json`,
      ).pipe(
          map(recipes => {
            let recipesArray = [];
            Object.keys(recipes).map(key => {
              recipesArray.push(recipes[key]);
            })
            return recipesArray.map(recipe => {
              return {
                ingredients: [],
                ...recipe,
              };
            });
          }),
          tap(recipes => {
            this.recipesService.setRecipes(recipes);
          })
        )
  }
}
