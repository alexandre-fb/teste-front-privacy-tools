class ImageFetcher {
  constructor() {
    this.loadingElement = document.querySelector("[data-loading]");
    this.imageElement = document.querySelector("[data-image='image']");
    this.api_url = "https://api-hachuraservi1.websiteseguro.com/api/document";
    this.headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic 96f9c92582aed580ba10a780e8af7fea57531c9c",
    };
  }

  updateImageSrc = (image) => {
    this.imageElement.src = image;
  };

  showLoading = (isVisible) => {
    if (isVisible) {
      this.loadingElement.classList.add("visible");
      this.imageElement.style.display = "none";
    } else {
      this.loadingElement.classList.remove("visible");
      this.imageElement.style.display = "block";
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

      return await response.json();
    } catch (error) {
      console.log("Não foi possível carregar a imagem", error);
    } finally {
      this.showLoading(false);
    }
  };

  fetchAndUpdateImage = async (page = 1) => {
    try {
      const data = await this.fetchImage(page);
      this.updateImageSrc(data.image);
    } catch (error) {
      console.log("Não foi possível atualizar a página", error);
    }
  };
}

export default ImageFetcher;
