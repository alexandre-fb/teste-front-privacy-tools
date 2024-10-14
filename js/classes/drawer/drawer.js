import { Square, SquareBlur, SquareHachura } from "./squares.js";

class Drawer {
  constructor(pagination, zoom) {
    this.canvas = document.getElementById("drawer");
    this.image = document.querySelector("[data-image='image']");
    this.ctx = this.canvas.getContext("2d");
    this.mouseIsDown = false;
    this.square = new Square(0, 0, 0, 0);
    this.squares = [];
    this.zoom = zoom;
    this.originalImageSize = null;
    this.pagination = pagination;
    this.drawModeIsEnable = false;
    this.selectedEffect = "null";
  }

  init = () => {
    this.originalImageSize = this.getImageSize();
    this.updateCanvasSize();
    this.loadSquaresFromLocalStorage();
    window.addEventListener("resize", this.handleWindowResize);

    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("contextmenu", this.handleContextMenu);
  };

  handleContextMenu = (event) => {
    event.preventDefault();
    if (!this.drawModeIsEnable) return;
    this.handleRemoveSquare(event);
  };

  handleWindowResize = () => {
    this.zoom.zoomSpecificValue(1);
    this.updateCanvasSize();
  };

  handleMouseDown = (event) => {
    event.preventDefault();
    if (!this.drawModeIsEnable) return;
    if (this.zoom.getCurrentZoom() !== 1) {
      this.zoom.zoomSpecificValue(1);
      return;
    }
    if (event.button === 2) return;
    if (event.button === 1) {
      this.handleRemoveSquare(event);
      return;
    }
    this.mouseIsDown = true;
    const { x, y } = this.getAdjustedCoordinates(event);
    this.square = this.createSquare(x, y);
  };

  handleMouseMove = (event) => {
    if (this.mouseIsDown) {
      const { x, y } = this.getAdjustedCoordinates(event);
      this.square.finalX = x;
      this.square.finalY = y;

      this.updateCanvas();
    }
  };

  handleMouseUp = (event) => {
    if (!this.drawModeIsEnable) return;
    if (event.button === 2) return;
    this.mouseIsDown = false;

    if (!this.square.isValidSize()) {
      this.square = new Square(0, 0, 0, 0);
      this.updateCanvas();
      return;
    }
    this.squares.push(this.square);
    this.square = null;
    this.saveSquaresToLocalStorage();
  };

  updateCanvasSize = () => {
    this.canvas.width = this.getImageSize().width;
    this.canvas.height = this.getImageSize().height;
    this.updateCanvas();
  };

  createSquare = (initialX, initialY) => {
    switch (this.selectedEffect) {
      case "blur":
        return new SquareBlur(initialX, initialY, initialX, initialY);
      case "hachura":
        return new SquareHachura(initialX, initialY, initialX, initialY);
      default:
        return new Square(initialX, initialY, initialX, initialY);
    }
  };

  getAdjustedCoordinates = (event) => {
    const currentZoom = this.zoom.getCurrentZoom();
    const imageArea = this.image.getBoundingClientRect();
    const scale = this.getScale();
    const x = (event.clientX - imageArea.left) / currentZoom / scale.scaleX;
    const y = (event.clientY - imageArea.top) / currentZoom / scale.scaleY;
    return { x, y };
  };

  updateCanvas = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const scale = this.getScale();
    this.squares.forEach((square) => {
      if (square instanceof SquareBlur) {
        square.drawBlur(this.ctx, this.image, scale);
      } else if (square instanceof SquareHachura) {
        square.drawHachura(this.ctx, scale);
      } else {
        square.draw(this.ctx, scale);
      }
    });

    if (this.square) {
      if (this.square instanceof SquareBlur) {
        this.square.drawBlur(this.ctx, this.image, scale);
      } else if (this.square instanceof SquareHachura) {
        this.square.drawHachura(this.ctx, scale);
      } else {
        this.square.draw(this.ctx, scale);
      }
    }
  };

  getScale = () => {
    const currentSize = this.getImageSize();
    const scaleX = currentSize.width / this.originalImageSize.width;
    const scaleY = currentSize.height / this.originalImageSize.height;
    return { scaleX, scaleY };
  };

  handleRemoveSquare = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const { x, y } = this.getAdjustedCoordinates(event);
    let squareRemoved = false;

    for (let i = this.squares.length - 1; i >= 0; i--) {
      const square = this.squares[i];
      const minX = Math.min(square.initialX, square.finalX);
      const maxX = Math.max(square.initialX, square.finalX);
      const minY = Math.min(square.initialY, square.finalY);
      const maxY = Math.max(square.initialY, square.finalY);

      if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
        this.removeSquare(i);
        squareRemoved = true;
        break;
      }
    }

    if (squareRemoved) {
      this.updateCanvas();
      this.saveSquaresToLocalStorage();
    }
  };

  removeSquare = (index) => {
    this.squares.splice(index, 1);
    this.updateCanvas();
  };

  getImageSize = () => {
    const imageArea = this.image.getBoundingClientRect();
    const width = imageArea.width;
    const height = imageArea.height;
    return { width, height };
  };

  saveSquaresToLocalStorage = () => {
    const currentPage = this.pagination.currentPage;
    const data = JSON.parse(localStorage.getItem("squaresData")) || {};
    data[currentPage] = this.squares;

    localStorage.setItem("squaresData", JSON.stringify(data));
  };

  loadSquaresFromLocalStorage = () => {
    const data = JSON.parse(localStorage.getItem("squaresData"));

    if (data) {
      const currentPage = this.pagination.currentPage;
      const squares = data[currentPage];
      if (squares && squares.length) {
        squares.forEach((square) => {
          switch (square.type) {
            case "blur":
              this.squares.push(
                new SquareBlur(
                  square.initialX,
                  square.initialY,
                  square.finalX,
                  square.finalY
                )
              );
              break;
            case "hachura":
              this.squares.push(
                new SquareHachura(
                  square.initialX,
                  square.initialY,
                  square.finalX,
                  square.finalY
                )
              );
              break;
            default:
              this.squares.push(
                new Square(
                  square.initialX,
                  square.initialY,
                  square.finalX,
                  square.finalY
                )
              );
              break;
          }
        });
      } else {
        this.squares = [];
      }
    } else {
      this.squares = [];
    }

    this.updateCanvas();
  };
}

export default Drawer;
