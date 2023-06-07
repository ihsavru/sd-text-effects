export const drawImage = (
  canvasRef,
  imgSrc,
  x,
  y,
  width,
  height,
  fontSize,
  fontFamily,
  text
) => {
  const targetCanvas = canvasRef.current;
  const targetContext = targetCanvas.getContext("2d");
  const image = new Image();

  image.src = imgSrc;

  image.onload = function () {
    const sourceCanvas = document.createElement("canvas");
    const sourceContext = sourceCanvas.getContext("2d");
    sourceCanvas.width = 300;
    sourceCanvas.height = 512;

    sourceContext.font = `${fontSize}px ${fontFamily}`;
    sourceContext.textAlign = "center";
    sourceContext.textBaseline = "middle";
    sourceContext.fillText(
      text,
      sourceCanvas.width / 2,
      sourceCanvas.height / 2
    );
    sourceContext.globalCompositeOperation = "source-in";
    sourceContext.drawImage(
      image,
      0,
      0,
      sourceCanvas.width,
      sourceCanvas.height
    );

    targetContext.drawImage(sourceCanvas, x, y, width, height);
  };
};

export const createText = (
  canvasWidth,
  canvasHeight,
  fontSize,
  font,
  letter,
  fillStyle,
  bg = true
) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  if (bg) {
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  const fontFamily = font;
  const text = letter;

  context.font = `${fontSize}px ${fontFamily}`;
  context.textAlign = "center";
  context.fillStyle = fillStyle;
  context.textBaseline = "middle";
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  return canvas.toDataURL("image/png").split(",")[1];
};

export const createTextMask = (
  width,
  height,
  imgSrc,
  font,
  letter,
  fontSize
) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;

    const image = new Image();
    image.src = imgSrc;

    image.onload = () => {
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      const fontFamily = font;
      const text = letter;

      context.globalCompositeOperation = "destination-in";

      context.font = `${fontSize}px ${fontFamily}`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(text, canvas.width / 2, canvas.height / 2);

      context.globalCompositeOperation = "destination-over";
      context.fillStyle = "white";
      context.fillText(text, canvas.width / 2, canvas.height / 2);

      resolve(canvas.toDataURL("image/png"));
    };

    image.onerror = () => {
      reject(new Error("Failed to load the image."));
    };
  });
};

export const clearCanvas = (canvasRef) => {
  const canvas = canvasRef.current;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
};
