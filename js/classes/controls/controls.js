class Controls {
  constructor(drawer) {
    this.drawer = drawer;
    this.enableDrawModeButton = document.querySelector(
      "[data-button='enable-draw']"
    );
    this.effectContollArea = document.querySelector(
      ".effects-controllers-area"
    );
    this.clearButton = document.querySelector("[data-button='clear']");
    this.blurEffectButton = document.querySelector(
      "[data-button='blur-effect']"
    );
    this.hachuraEffectButton = document.querySelector(
      "[data-button='hachura-effect']"
    );
    this.basicEffectButton = document.querySelector(
      "[data-button='basic-effect']"
    );
  }

  init = () => {
    this.enableDrawModeButton.addEventListener("click", this.handleDrawMode);
    this.clearButton.addEventListener("click", this.handleClear);
    this.blurEffectButton.addEventListener("click", this.handleBlurEffect);
    this.hachuraEffectButton.addEventListener(
      "click",
      this.handleHachuraEffect
    );
    this.basicEffectButton.addEventListener("click", this.handleBasicEffect);
    this.handleHachuraEffect();
  };

  handleDrawMode = () => {
    this.enableDrawModeButton.classList.toggle("active");
    this.drawer.drawModeIsEnable = !this.drawer.drawModeIsEnable;

    if (this.drawer.drawModeIsEnable) {
      this.enableDrawModeButton.innerHTML = "Desabilitar modo de desenho";
      this.effectContollArea.classList.add("active");
    } else {
      this.enableDrawModeButton.innerHTML = "Habilitar modo de desenho";
      this.effectContollArea.classList.remove("active");
    }
  };

  handleBlurEffect = () => {
    this.removeActiveClass();
    this.blurEffectButton.classList.add("active");
    this.drawer.selectedEffect = "blur";
  };
  
  handleHachuraEffect = () => {
    this.removeActiveClass();
    this.hachuraEffectButton.classList.add("active");
    this.drawer.selectedEffect = "hachura";
  };

  handleBasicEffect = () => {
    this.removeActiveClass();
    this.basicEffectButton.classList.add("active");
    this.drawer.selectedEffect = "basic";
  };

  handleClear = () => {
    this.drawer.squares = [];
    this.drawer.updateCanvas();
    this.removePageDataLocalStorage();
  };

  removeActiveClass = () => {
    this.blurEffectButton.classList.remove("active");
    this.hachuraEffectButton.classList.remove("active");
    this.basicEffectButton.classList.remove("active");
  };

  removePageDataLocalStorage = () => {
    const currentPage = this.drawer.pagination.currentPage;
    const data = JSON.parse(localStorage.getItem("squaresData")) || {};

    if (data[currentPage]) {
      delete data[currentPage];
      localStorage.setItem("squaresData", JSON.stringify(data));
    }
  };
}

export default Controls;
