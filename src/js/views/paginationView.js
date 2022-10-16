import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  //we will make  apublisher subscriber patern here  with  addHandlerClick  function
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline'); //REmember when we have many choices to click on
      if (!btn) return; // return nothing if we click outside of button

      //Get the number from the button
      const goToPage = +btn.dataset.goto; // "+" to change the result to a number
      //console.log(goToPage);
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log(numPages);

    //but why did we actually select the button? Well, we need a way of knowing which is the page where we need to go now.---> using the costom data attribute

    // Page1 , and there are other pages
    if (curPage === 1 && numPages > 1) {
      return `
      <button data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
      <span>Page${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;
    }

    // Last page
    if (curPage === numPages) {
      return `<button  data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${curPage - 1}</span>
    </button>`;
    }
    //Other page
    if (curPage < numPages) {
      return `
      
      <button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${curPage - 1}</span>
    </button>
      <button data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
      <span> Page${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
    `;
    }

    // Page1 , and there are No other pages
    return '';
  }
}

export default new PaginationView();
