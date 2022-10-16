class searchView {
  _parentEl = document.querySelector('.search');

  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    //we will once again,use the publisher subscriber pattern.So we will list in for the event in the searchview right here,and then pass the controller function.So the handler function into the method that we will build here.So this addHandler, a search method hereis basically goingto be the publisher anti-control search results function is going to be the subscriber.

    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault(); //Now here, we cannot simply call the handler immediately,because when we submit a form,we need to first prevent the default action,because otherwise the page is going to reload.
      handler();
    });
  }
}
export default new searchView();
