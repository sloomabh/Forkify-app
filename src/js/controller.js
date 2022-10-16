import * as model from './model.js'; //import all
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable'; // Polyfilling everything else
import 'regenerator-runtime/runtime'; // Polyfilling async/await

/////////////////////////////////////////////
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

///////

// if (module.hot) {
//   module.hot.accept();
// }
//It enables the hot module replacement, which reloads the modules that changed without refreshing the whole website.
// You can read more at https://parceljs.org/hmr.html

////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1); // take the id from the window url

    // a gard class
    if (!id) return;
    recipeView.renderSpinner();
    //console.log(recipeView);

    // 0)Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage()); // we changed render with update so we wont upload pictures again
    // 3) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);
    // 1) Loading Recipe
    await model.loadRecipe(id); //when an async function calling an other async function  and we know async function return a promise
    //const { recipe } = model.state;

    // 2) Rendering recipe
    recipeView.render(model.state.recipe); // it is the same like >     const reecipeView = new recipeView(model.state.recipe)
    // recipeView.renderSpinner(0);

    //controlServings();
  } catch (err) {
    recipeView.renderError(`${err} ya salim controle `);
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner(); // resultsView is child class of the View parent class  ---> methode unheritance

    //1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2)Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    //resultsView.render(model.state.search.results);   //preiouvsly
    resultsView.render(model.getSearchResultsPage()); //show the first 10 in in the list

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //Just copy paste from  controlSearchResults async function
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));
  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Updating th erecipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.render(model.state.recipe);
};

const controleAddBookmark = function () {
  // 1) Add/Remove bookmark
  if (!model.state.recipe.bookmarked)
    model.addBookmark(model.state.recipe); // when we add bookmark
  else model.deleteBookmark(model.state.recipe.id);

  console.log(model.state.recipe);
  // 2) Update recipe view
  recipeView.update(model.state.recipe); //we uodate only the element that has changed

  // 3)Render boookmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  //if there is an error comes from model.uploadRecipe(newRecipe); we throw an eroor
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();
    // Upload the new recipe data
    await model.uploadRecipe(newRecipe); //in model.js the function returnapromise so we need awit for that promise
    console.log(model.state.recipe);

    // Remder recipe
    recipeView.render(model.state.recipe);

    // Success messge
    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarksView.render(model.state.bookmarks); //we rae inserting new element so no need for update

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.id}`); //history API of the browser--pushstate allows us tochange the URL without reloading the page

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('EROOOOOOOOOOOr!!!', err);
    addRecipeView.renderError(err.message);
  }
};

//With this, we just implemented the Publisher-Subscriber pattern.
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes); //call the function  controlRecipes()
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controleAddBookmark);
  searchView.addHandlerSearch(controlSearchResults); //call the function  controlSearchResults()
  paginationView.addHandlerClick(controlPagination); //when it calls paginationView.addHandlerClick from paginationView.Js , // it will call the handler which is here with name controlPagination (the argument)
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
