class Drawer {
  constructor(zoom) {
    this.canvas = document.getElementById("drawer");
    this.image = document.querySelector("[data-image='image']");
    this.ctx = this.canvas.getContext("2d");
    this.mouseIsDown = false;
    this.square = new Square(0, 0, 0, 0);
    this.squares = this.loadSquaresFromLocalStorage() || [];
    this.zoom = zoom;
  }

  init = () => {
    this.canvas.width = this.getImageSize().width;
    this.canvas.height = this.getImageSize().height;
    if (this.squares.length > 0) this.updateCanvas();
    window.addEventListener("resize", () => {
      this.canvas.width = this.getImageSize().width;
      this.canvas.height = this.getImageSize().height;
      this.updateCanvas();
    });

    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("contextmenu", this.handleRemoveSquare);
  };

  handleMouseDown = (event) => {
    event.preventDefault();
    if (event.button === 2) return;
    if (event.button === 1) {
      this.handleRemoveSquare(event);
      return;
    }
    console.log("event", event);
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
    console.log("currentZoom", currentZoom);
    const imageArea = this.image.getBoundingClientRect();
    const x = (event.clientX - imageArea.left) / currentZoom;
    const y = (event.clientY - imageArea.top) / currentZoom;
    return { x, y };
  };

  handleMouseUp = (event) => {
    if (event.button === 2) return;
    this.mouseIsDown = false;

    console.log(!this.square.isValidSize());
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
    console.log("this.squares mouse up", this.squares);
  };

  updateCanvas = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.squares.forEach((square) => square.draw(this.ctx));
    this.square.draw(this.ctx);
  };

  handleRemoveSquare = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const { x, y } = this.getAdjustedCoordinates(event);
    console.log("this.squares right click", this.squares);
    let squareRemoved = false;
    console.log("x, y", x, y);

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
    localStorage.setItem("squares", JSON.stringify(squaresData));
  };

  loadSquaresFromLocalStorage = () => {
    const squaresData = JSON.parse(localStorage.getItem("squares"));
    if (squaresData) {
      return squaresData.map(
        (square) =>
          new Square(
            square.initialX,
            square.initialY,
            square.finalX,
            square.finalY
          )
      );
    }
    return null;
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

  draw = (ctx) => {
    this.updateDimensions();
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(this.initialX, this.initialY, this.width, this.height);
  };

  updateDimensions = () => {
    this.width = this.finalX - this.initialX;
    this.height = this.finalY - this.initialY;
  };

  isValidSize = () => {
    console.log("this.width", this.width, this.height);
    return Math.abs(this.width) >= 2 && Math.abs(this.height) >= 2;
  };
}

export default Drawer;
