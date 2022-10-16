import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded';
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe'); // ADD RECIPE button on screen
  _btnClose = document.querySelector('.btn--close-modal');
  constructor() {
    super();
    this._addhandlerShowWindow();
    this._addhandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }
  _addhandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this)); //this refer to this object now not to addhandlerShowWindow
  }

  _addhandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  // when we click on submit button
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)]; // this refer to this._parentElement element in this case
      const data = Object.fromEntries(dataArr); //take an array of entries and converts to an object
      handler(data);
    });
  }
  _generateMarkup() {}
}

export default new AddRecipeView();
/* salim test*/
