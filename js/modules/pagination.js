import { fetchAndUpdateImage } from "./fetchAndUpdateImage.js";

const paginationButtons = document.querySelectorAll(
  '[data-button^="pagination"]'
);
let inputCurrentPage = document.querySelector(
  '[data-input="pagination-current-page"]'
);

let currentPage = 1;
let totalPages = 100;
const currentPageFromLocalStorage = parseInt(localStorage.getItem("currentPage"));

const updateCurrentPage = (amountPageToChange, pageToGo) => {
  if (pageToGo) {
    currentPage = pageToGo;
    console.log('entrou')
  } else {
    currentPage += amountPageToChange;
  }


  if (currentPage < 1) {
    currentPage = 1;
  } else if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  inputCurrentPage.value = currentPage;
  localStorage.setItem("currentPage", currentPage);
};

export const initPagination = () => {
  if(currentPageFromLocalStorage) {
    updateCurrentPage(0, currentPageFromLocalStorage);
  }
    addPaginationEventListeners()
    fetchAndUpdateImage(currentPage);
}

const handlePaginationButtonClick = (event) => {
  const buttonDataset = event.target.dataset.button;
  switch (buttonDataset) {
    case "pagination-next":
      updateCurrentPage(1);
      break;
    case "pagination-next-10":
      updateCurrentPage(10);
      break;
    case "pagination-prev":
      updateCurrentPage(-1);
      break;
    case "pagination-prev-10":
      updateCurrentPage(-10);
      break;
  }

  updateButtonStates();
  fetchAndUpdateImage(currentPage);
};

const handleInputCurrentPageChange = () => {
  updateCurrentPage(0, parseInt(inputCurrentPage.value));
  updateButtonStates();
  fetchAndUpdateImage(currentPage);
};

const updateButtonStates = () => {
  paginationButtons.forEach((button) => {
    button.disabled = false;

    const buttonDataset = button.dataset.button;
    if (
      (buttonDataset === "pagination-prev" ||
        buttonDataset === "pagination-prev-10") &&
      currentPage === 1
    ) {
      button.disabled = true;
    } else if (
      (buttonDataset === "pagination-next" ||
        buttonDataset === "pagination-next-10") &&
      currentPage === totalPages
    ) {
      button.disabled = true;
    }
  });
};

export const addPaginationEventListeners = () => {
  paginationButtons.forEach((button) => {
    button.addEventListener("click", handlePaginationButtonClick);
  });

  inputCurrentPage.addEventListener("change", handleInputCurrentPageChange);
};
