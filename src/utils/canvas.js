export const drawImage = (canvasRef, imgSrc, x, y, width, height) => {
  const canvas = canvasRef.current;
  const context = canvas.getContext("2d");
  const image = new Image();

  image.src = imgSrc;

  image.onload = function () {
    context.drawImage(image, x, y, width, height);
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
