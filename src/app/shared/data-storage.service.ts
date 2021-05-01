import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, tap } from "rxjs/operators";

import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";

@Injectable({providedIn: 'root'})
export class DataStorageService {
  constructor(private http: HttpClient, private recipesService: RecipeService) {}

  storeRecipes() {
    const recipes = this.recipesService.getRecipes();
    this.http
      .put('https://ng-recipe-book-42315-default-rtdb.europe-west1.firebasedatabase.app/recipes.json', recipes)
      .subscribe(response => {
        console.log(response)
      });
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>('https://ng-recipe-book-42315-default-rtdb.europe-west1.firebasedatabase.app/recipes.json')
      .pipe(map(recipes => {
        return recipes.map(recipe => {
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
