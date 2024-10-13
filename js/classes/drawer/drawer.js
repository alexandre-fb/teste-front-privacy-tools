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
  }

  init = () => {
    this.originalImageSize = this.getImageSize();
    this.updateCanvasSize();
    this.loadSquaresFromLocalStorage();
    window.addEventListener("resize", this.updateCanvasSize);

    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("contextmenu", this.handleRemoveSquare);
  };

  updateCanvasSize = () => {
    this.canvas.width = this.getImageSize().width;
    this.canvas.height = this.getImageSize().height;
    this.updateCanvas();
  };

  handleMouseDown = (event) => {
    event.preventDefault();
    if (event.button === 2) return;
    if (event.button === 1) {
      this.handleRemoveSquare(event);
      return;
    }
    this.mouseIsDown = true;
    const { x, y } = this.getAdjustedCoordinates(event);
    this.square.initialX = x;
    this.square.initialY = y;
  };

  handleMouseMove = (event) => {
    if (this.mouseIsDown) {
      const { x, y } = this.getAdjustedCoordinates(event);
      this.square.finalX = x;
      this.square.finalY = y;

      this.updateCanvas();
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

  handleMouseUp = (event) => {
    if (event.button === 2) return;
    this.mouseIsDown = false;

    if (!this.square.isValidSize()) {
      this.square = new Square(0, 0, 0, 0);
      this.updateCanvas();
      return;
    }

    this.squares.push(
      new Square(
        this.square.initialX,
        this.square.initialY,
        this.square.finalX,
        this.square.finalY
      )
    );
    this.square = new Square(0, 0, 0, 0);
    this.saveSquaresToLocalStorage();
  };

  updateCanvas = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const scale = this.getScale();
    this.squares.forEach((square) => square.draw(this.ctx, scale));
    this.square.draw(this.ctx, scale);
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
    const squaresData = this.squares.map((square) => ({
      initialX: square.initialX,
      initialY: square.initialY,
      finalX: square.finalX,
      finalY: square.finalY,
    }));

    const currentPage = this.pagination.currentPage;
    const data = JSON.parse(localStorage.getItem("squaresData")) || {};
    data[currentPage] = squaresData;

    localStorage.setItem("squaresData", JSON.stringify(data));
  };

  loadSquaresFromLocalStorage = () => {
    const data = JSON.parse(localStorage.getItem("squaresData"));

    if (data) {
      const currentPage = this.pagination.currentPage;
      const squares = data[currentPage];

      if (squares && squares.length) {
        this.squares = squares.map(
          (square) =>
            new Square(
              square.initialX,
              square.initialY,
              square.finalX,
              square.finalY
            )
        );
      } else {
        this.squares = [];
      }
    } else {
      this.squares = [];
    }

    this.updateCanvas();
  };
}

class Square {
  constructor(initialX, initialY, finalX, finalY) {
    this.initialX = initialX;
    this.initialY = initialY;
    this.finalX = finalX;
    this.finalY = finalY;
    this.width = this.finalX - this.initialX;
    this.height = this.finalY - this.initialY;
  }

  draw = (ctx, scale) => {
    this.updateDimensions();
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(
      this.initialX * scale.scaleX,
      this.initialY * scale.scaleY,
      this.width * scale.scaleX,
      this.height * scale.scaleY
    );
  };

  updateDimensions = () => {
    this.width = this.finalX - this.initialX;
    this.height = this.finalY - this.initialY;
  };

  isValidSize = () => {
    return Math.abs(this.width) >= 2 && Math.abs(this.height) >= 2;
  };
}

export default Drawer;
