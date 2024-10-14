class ImageFetcher {
  constructor() {
    this.loadingElement = document.querySelector("[data-loading]");
    this.imageElement = document.querySelector("[data-image='image']");
    this.api_url = "https://api-hachuraservi1.websiteseguro.com/api/document";
    this.headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic 96f9c92582aed580ba10a780e8af7fea57531c9c",
    };
    this.drawer = null;
    this.pagination = null;
    this.totalPage = 1;
  }

  updateImageSrc = (image) => {
    this.imageElement.src = image;
  };

  setDrawer(drawer) {
    this.drawer = drawer;
  }

  setPagination(pagination) {
    this.pagination = pagination;
  }

  showLoading = (isVisible) => {
    if (isVisible) {
      this.loadingElement.classList.add("visible");
      this.imageElement.style.display = "none";
      this.drawer.canvas.style.display = "none";
      this.pagination.paginationButtons.forEach((button) => {
        button.disabled = true;
      });
    } else {
      this.loadingElement.classList.remove("visible");
      this.imageElement.style.display = "block";
      this.drawer.canvas.style.display = "block";
      this.pagination.paginationButtons.forEach((button) => {
        button.disabled = false;
      });
    }
  };

  fetchImage = async (page) => {
    const body = new URLSearchParams({
      page: page,
    });

    try {
      this.showLoading(true);
      const response = await fetch(this.api_url, {
        method: "POST",
        headers: this.headers,
        body,
      });

      if (response.headers.has("total_page")) {
        this.totalPage = response.headers.get("total_page");
      } else {
        this.totalPage = 1493;
      }

      this.pagination.setTotalPages(this.totalPage);

      return await response.json();
    } catch (error) {
      console.log("Não foi possível carregar a imagem", error);
    } finally {
      this.showLoading(false);
    }
  };

  fetchAndUpdateImage = async (page = 1, firstFetch) => {
    try {
      const data = await this.fetchImage(page);
      this.updateImageSrc(data.image);
      if (firstFetch) return;
      this.updateDrawer();
    } catch (error) {
      console.log("Não foi possível atualizar a página", error);
    }
  };

  updateDrawer = () => {
    this.drawer.init();
    this.drawer.updateCanvas();
  };

  getTotalPages = () => {
    return this.totalPage;
  };
}

export default ImageFetcher;
