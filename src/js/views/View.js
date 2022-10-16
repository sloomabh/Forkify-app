//we will use it as parent class for the other child views --- > so we will export it immediately we dont need for instances

import icons from 'url:../../img/icons.svg'; //Parcel2   //import icons from '../img/icons.svg'; //Parcel1

export default class View {
  _data;
  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g recipe)
   * @param {boolean} [render=true] If false , create markup string instead of rendering to the DOM
   * @returns {undefined | string} Amarkup string is returned if render =false
   * @this {Object} View instance
   * @author Salim Ben halima
   * @todo Finish implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError(); //gard function

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear(); //empty recipeContainer first before inserting any element (good tick to use)
    this._parentElement.insertAdjacentHTML('afterbegin', markup); // first child with afterbegin
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup); //a virtuel DOM
    const newElements = Array.from(newDOM.querySelectorAll('*')); // first we get nodelist of all elements then we put them in an  array
    const curElements = Array.from(this._parentElement.querySelectorAll('*')); //real DOM

    newElements.forEach((newEl, i) => {
      //we make the comparison
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      // Updates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('💥', newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      // Updates changed ATTRIBUES
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner = function () {
    const markup = `
    <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };

  //  renderError() :  Displaing the error message  to the user
  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  //  renderMessage() :  Displaing the success message  to the user
  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
