import ImageFetcher from "../imageFetcher/imageFetcher.js";
import Pagination from "../pagination/pagination.js";
import Drawer from "../drawer/drawer.js";
import Zoom from "../zoom/zoom.js";
import Controls from "../controls/controls.js";

class App {
  constructor() {
    this.imageFetcher = new ImageFetcher();
    this.pagination = new Pagination(this.imageFetcher);
    this.zoom = new Zoom();
    this.drawer = new Drawer(this.pagination, this.zoom);
    this.controls = new Controls(this.drawer);
    this.imageFetcher.setDrawer(this.drawer);
    this.imageFetcher.setPagination(this.pagination);
    this.pageSavedLocalStorage = parseInt(
      localStorage.getItem("appCurrentPage")
    );

    this.init();
  }

  async init() {
    this.controls.init();
    this.pagination.init();
    this.setCurrentPage();
    await this.updateImageAndInitializeDrawer();
  }

  setCurrentPage() {
    if (this.pageSavedLocalStorage) {
      this.pagination.currentPage = this.pageSavedLocalStorage;
      this.pagination.updateInputPage();
      return;
    }

    this.pagination.currentPage = 1;
  }

  async updateImageAndInitializeDrawer() {
    try {
      await this.imageFetcher.fetchAndUpdateImage(
        this.pagination.currentPage,
        true
      );
      this.drawer.init();
    } catch (error) {
      console.error("Erro ao atualizar a imagem:", error);
    }
  }
}

export default App;
