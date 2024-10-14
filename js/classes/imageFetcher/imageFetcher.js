class ImageFetcher {
  constructor() {
    this.loadingElement = document.querySelector("[data-loading]");
    this.imageElement = document.querySelector("[data-image='image']");
    this.errorElement = document.querySelector("[data-error='fetch-image']")
    this.api_url = "https://api-hachuraservi1.websiteseguro.com/api/document";
    this.headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic 96f9c92582aed580ba10a780e8af7fea57531c9c",
    };
    this.drawer = null;
    this.pagination = null;
    this.totalPage = 1;
    this.hasFetchError = false
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

  fetchImage = async (page, isFirstFetch) => {
    const body = new URLSearchParams({
      page: page,
    });

    try {
      this.hasFetchError = false;
      this.showLoading(true);
      const response = await fetch(this.api_url, {
        method: "POST",
        headers: this.headers,
        body,
      });

      if(isFirstFetch) {
        this.setTotalPage(response);
      }
      
      return await response.json();
    } catch (error) {
      console.log("Não foi possível carregar a imagem", error);
      this.hasFetchError = true;
    } finally {
      this.showLoading(false);
    }
  };

  showLoading = (isVisible) => {
    if (isVisible) {
      this.loadingElement.classList.add("visible");
      this.disablePaginationButtons(true);
      this.updateElementsVisibility(true);
    } else {
      this.loadingElement.classList.remove("visible");
      this.disablePaginationButtons(false);
      this.updateElementsVisibility(false);
    }
  };

  disablePaginationButtons = (isDisabled) => {
    this.pagination.paginationButtons.forEach((button) => {
      button.disabled = isDisabled;
    });
  };
  
  updateElementsVisibility = (loadingIsActive) => {
    if (loadingIsActive) {
      this.imageElement.style.display = 'none';
      this.drawer.canvas.style.display = 'none';
      this.errorElement.classList.remove('active');
      return
    }
    if (this.hasFetchError) {
      this.imageElement.style.display = 'none';
      this.drawer.canvas.style.display = 'none';
      this.errorElement.classList.add('active');
    } else {
      this.imageElement.style.display = 'block';
      this.drawer.canvas.style.display = 'block';
      this.errorElement.classList.remove('active');
    }
  };

  setTotalPage = (response) => {
    if (response.headers.has("total_page")) {
      this.totalPage = response.headers.get("total_page");
    } else {
      this.totalPage = 1493;
    }

    this.pagination.setTotalPages(this.totalPage);
  };

  fetchAndUpdateImage = async (page = 1, isFirstFetch = false) => {
    try {
      const data = await this.fetchImage(page, isFirstFetch);
      this.updateImageSrc(data.image);
      if (isFirstFetch) return;
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
