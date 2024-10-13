class Zoom {
  constructor() {
    this.zoom = 1;
    this.imageWrapper = document.querySelector("[data-image='wrapper']");

    this.init();
  }

  init = () => {
    this.imageWrapper.addEventListener("wheel", (event) => {
      event.preventDefault();
      if (event.deltaY > 0) {
        this.zoomOut();
      } else {
        this.zoomIn();
      }
    });
  };

  zoomIn = () => {
    this.zoom = Math.min(this.zoom + 0.1, 3);
    this.imageWrapper.style.transform = `scale(${this.zoom})`;
    if (this.zoom > 3) this.zoom = 3;
  };

  zoomOut = () => {
    this.zoom = Math.max(this.zoom - 0.1, 1);
    this.imageWrapper.style.transform = `scale(${this.zoom})`;
    if (this.zoom < 1) this.zoom = 1;
  };

  getCurrentZoom = () => {
    return this.zoom;
  };
}

export default Zoom;
