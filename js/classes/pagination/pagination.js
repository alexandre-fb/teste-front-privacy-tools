class Pagination {
  constructor(imageFetcher) {
    this.paginationButtons = document.querySelectorAll(
      '[data-button="pagination"]'
    );
    this.inputCurrentPage = document.querySelector(
      '[data-input="current-page"]'
    );
    this.totalPageLabel = document.querySelector('[data-input="total-page"]');
    this.currentPage = 1;
    this.totalPages = null;
    this.imageFetcher = imageFetcher;
  }

  init() {
    this.paginationButtons.forEach((button) => {
      button.addEventListener("click", this.handleButtonClick);
    });

    this.inputCurrentPage.addEventListener(
      "change",
      this.handleInputPageChange
    );
    this.validatePageRange();
  }

  setTotalPages = (totalPages) => {
    this.totalPages = totalPages;
    this.totalPageLabel.innerHTML = "/ " + this.totalPages;
  };

  handleButtonClick = (event) => {
    const valueToIncrement = event.target.dataset.buttonIncrement;
    this.incrementPage(valueToIncrement);
  };

  incrementPage = (amountToIncrement) => {
    this.currentPage += parseInt(amountToIncrement);
    this.validatePageRange();
    this.updateInputPage();
    this.saveNewPageLocalStorage();
    this.imageFetcher.fetchAndUpdateImage(this.currentPage);
  };

  validatePageRange = () => {
    if (this.currentPage < 1) {
      this.currentPage = 1;
    } else if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  };

  handleInputPageChange = (event) => {
    this.currentPage = parseInt(event.target.value);
    this.validatePageRange();
    this.saveNewPageLocalStorage();
    this.imageFetcher.fetchAndUpdateImage(this.currentPage);
    this.updateInputPage()
  };

  updateInputPage = () => {
    this.inputCurrentPage.value = this.currentPage;
  };

  saveNewPageLocalStorage = () => {
    localStorage.setItem("appCurrentPage", this.currentPage);
  };
}

export default Pagination;
