import ImageFetcher from "../imageFetcher/imageFetcher.js";
import Pagination from "../pagination/pagination.js";
import Drawer from "../drawer/drawer.js";
import Zoom from "../zoom/zoom.js";
class App {
  constructor() {
    this.imageFetcher = new ImageFetcher();
    this.pagination = new Pagination(this.imageFetcher);
    this.zoom = new Zoom();
    this.drawer = new Drawer(this.zoom);
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
    setTimeout(() => {
      this.drawer.init();
    }, 3000);
    this.zoom.init();
  }
}

export default App;
