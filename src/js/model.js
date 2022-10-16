import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config';
//import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};
/////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////bring all  business logic (that make application working itself)/////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////s

//
const createRecipeObject = function (data) {
  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), //good trick to add the key if it does exist
  };
};

// loadRecipe this function will be the one responsible for actually fetching the recipe data from our Forkify API.And so this is oingo be an async function
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`); //And so here, that's why we then await that promise and store that resolved value into the data variable.
    state.recipe = createRecipeObject(data);
    //here the as we got all this data and store it in the state.Then what we can do is to check if there is already a recipe with the same ID in the bookmarks state.And if it is then we will mark the current recipe that we just loaded from the API as bookmarked set to true
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    //console.log(recipe);
  } catch (err) {
    // Temp error handling
    console.error(`${err} ya sloooooooooooooma model `);
    throw err; // we use throw error to pass it to the controller
  }
};

// Rendering search results
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    // console.log(data);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        sourceUrl: rec.source_url,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1; //when we chge the search value to other thing oasta or pizza or . ..it reload to page 1
  } catch (err) {
    console.error(`${err} ya sloooooooooooooma model`);
    throw err; // we use throw error to pass it to the controller
  }
};

//  Pgination
// we want here to render th 10 first food in the list  // also we donot need an async function the data is already danlowedd
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; //0 ;
  const end = page * state.search.resultsPerPage; //9 ;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    //newQt = oldQt * newservings  / oldservings  //
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  // we update the servings of current recipe
  state.recipe.servings = newServings;
};

// Persist data  in local storage of browser
//save data in local storege
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

//Book Mark
export const addBookmark = function (recipe) {
  //add bookmark
  state.bookmarks.push(recipe);
  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true; //we are setting a new proprety on this recipe object
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  //delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

// Take out data stored{} in the local storage
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

console.log(state.bookmarks);

// Function for debugging we might call it during the development
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
//clearBookmarks();

// Making request to the API
export const uploadRecipe = async function (newRecipe) {
  try {
    console.log(Object.entries(newRecipe));
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1]
          .replaceAll(' ', '')
          .split(',')
          .map(el => el.trim());
        //const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'wrong ingredient format ! please use the correct format!'
          );

        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      }); //  Convert object to an array --> the opposite of Object.fromEntries()

    //create an object that is ready to be uploaded
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe); //  (url , data)
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
