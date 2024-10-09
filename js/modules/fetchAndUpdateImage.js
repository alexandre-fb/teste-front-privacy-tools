const loadingElement = document.querySelector("[data-loading]");
const imageElement = document.querySelector("[data-image]");

const updateImageSrc = (image) => {
  imageElement.src = image;
};

const showLoading = (isVisible) => {
  if (isVisible) {
    loadingElement.classList.add("visible");
    imageElement.style.display = "none";
    return;
  }

  loadingElement.classList.remove("visible");
  imageElement.style.display = "block";
};

const fetchImage = async (page) => {
  const api_url = "https://api-hachuraservi1.websiteseguro.com/api/document";

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: "Basic 96f9c92582aed580ba10a780e8af7fea57531c9c",
  };

  const body = new URLSearchParams({
    page: page,
  });

  try {
    showLoading(true);
    const response = await fetch(api_url, {
      method: "POST",
      headers,
      body,
    });

    return await response.json();
  } catch (error) {
    console.log("Não foi possível carregar a página", error);
  } finally {
    showLoading(false);
  }
};

export const fetchAndUpdateImage = async (page = 1) => {
  try {
    const data = await fetchImage(page);
    updateImageSrc(data.image);
  } catch (error) {
    console.log("Não foi possível atualizar a página", error);
  }
};