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
        this.zoomOut(event);
      } else {
        this.zoomIn(event);
      }
    });
  };

  zoomIn = (event) => {
    this.zoom = Math.min(this.zoom + 0.1, 1.8);

    if (this.zoom > 1.8) this.zoom = 1.8;

    const imageWrapperArea = this.imageWrapper.getBoundingClientRect();
    const offsetX = event.clientX - imageWrapperArea.left;
    const offsetY = event.clientY - imageWrapperArea.top;

    const originX = (offsetX / imageWrapperArea.width) * 100;
    const originY = (offsetY / imageWrapperArea.height) * 100;

    this.imageWrapper.style.transformOrigin = `${originX}% ${originY}%`;
    this.imageWrapper.style.transform = `scale(${this.zoom})`;
  };

  zoomOut = (event) => {
    this.zoom = Math.max(this.zoom - 0.1, 1);
    this.imageWrapper.style.transform = `scale(${this.zoom})`;
    if (this.zoom < 1) this.zoom = 1;
  };

  zoomSpecificValue = (value) => {
    this.zoom = value;
    this.imageWrapper.style.transform = `scale(${this.zoom})`;
  };

  getCurrentZoom = () => {
    return this.zoom;
  };
}

export default Zoom;
