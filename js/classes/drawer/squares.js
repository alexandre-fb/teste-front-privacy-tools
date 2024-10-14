class Square {
  constructor(initialX, initialY, finalX, finalY, type) {
    this.initialX = initialX;
    this.initialY = initialY;
    this.finalX = finalX;
    this.finalY = finalY;
    this.width = this.finalX - this.initialX;
    this.height = this.finalY - this.initialY;
    this.type = type || null;
  }

  draw = (ctx, scale) => {
    this.updateDimensions();
    ctx.fillStyle = "#B3B2FE50";
    ctx.fillRect(
      this.initialX * scale.scaleX,
      this.initialY * scale.scaleY,
      this.width * scale.scaleX,
      this.height * scale.scaleY
    );
    ctx.strokeStyle = "#c35252";
    ctx.lineWidth = 2;
    ctx.strokeRect(
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

class SquareBlur extends Square {
  constructor(initialX, initialY, finalX, finalY) {
    super(initialX, initialY, finalX, finalY, "blur");
  }

  drawBlur = (ctx, image, scale) => {
    this.updateDimensions();
    const startX = Math.min(this.initialX, this.finalX) * scale.scaleX;
    const startY = Math.min(this.initialY, this.finalY) * scale.scaleY;
    const endX = Math.max(this.initialX, this.finalX) * scale.scaleX;
    const endY = Math.max(this.initialY, this.finalY) * scale.scaleY;
    const width = endX - startX;
    const height = endY - startY;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext("2d");

    tempCtx.drawImage(
      image,
      startX / scale.scaleX,
      startY / scale.scaleY,
      width / scale.scaleX,
      height / scale.scaleY,
      0,
      0,
      width,
      height
    );

    tempCtx.filter = "blur(2px)";
    tempCtx.drawImage(tempCanvas, 0, 0);

    ctx.drawImage(tempCanvas, startX, startY);

    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(startX, startY, width, height);
    ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, width, height);
  };
}

class SquareHachura extends Square {
  constructor(initialX, initialY, finalX, finalY) {
    super(initialX, initialY, finalX, finalY, "hachura");
  }

  drawHachura = (ctx, scale) => {
    this.updateDimensions();

    const startX = Math.min(this.initialX, this.finalX) * scale.scaleX;
    const startY = Math.min(this.initialY, this.finalY) * scale.scaleY;
    const endX = Math.max(this.initialX, this.finalX) * scale.scaleX;
    const endY = Math.max(this.initialY, this.finalY) * scale.scaleY;
    const width = endX - startX;
    const height = endY - startY;

    ctx.save();

    ctx.beginPath();
    ctx.rect(startX, startY, width, height);
    ctx.clip();

    const spacing = 10;
    ctx.strokeStyle = "#1971c2";
    ctx.lineWidth = 1;

    ctx.beginPath();
    for (let x = startX - height; x < endX + height; x += spacing) {
      ctx.moveTo(x, startY);
      ctx.lineTo(x + height, endY);
    }
    for (let y = startY - width; y < endY + width; y += spacing) {
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y + width);
    }
    ctx.stroke();

    ctx.restore();

    ctx.strokeStyle = "#1971c2";
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, width, height);
  };
}

export { Square, SquareBlur, SquareHachura };
