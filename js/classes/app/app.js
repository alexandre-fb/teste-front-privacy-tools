import ImageFetcher from "../imageFetcher/imageFetcher.js";
import Pagination from "../pagination/pagination.js";

class App {
  constructor() {
    this.imageFetcher = new ImageFetcher();
    this.pagination = new Pagination(this.imageFetcher);
    this.pageSavedLocalStorage = parseInt(
      localStorage.getItem("appCurrentPage")
    );

    this.init();
  }

  init() {
    this.pagination.init();

    if (this.pageSavedLocalStorage) {
      this.pagination.currentPage = this.pageSavedLocalStorage;
      this.pagination.validatePageRange();
      this.pagination.updateInputPage();
      this.imageFetcher.fetchAndUpdateImage(this.pagination.currentPage);
    } else {
      this.imageFetcher.fetchAndUpdateImage(1);
    }
  }
}

export default App;
