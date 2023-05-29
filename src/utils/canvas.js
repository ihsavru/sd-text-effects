export const createTextMask = (imgSrc, font, letter, fontSize) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = 512;
    canvas.height = 512;

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

export const createText = (canvasSize, fontSize, font, letter) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = canvasSize;
  canvas.height = canvasSize;

  const fontFamily = font;
  const text = letter;

  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.font = `${fontSize}px ${fontFamily}`;
  context.textAlign = "center";
  context.fillStyle = "black";
  context.textBaseline = "middle";
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  return canvas.toDataURL("image/png");
};

export const drawImage = (canvasRef, imgSrc, x, y) => {
  const canvas = canvasRef.current;
  const context = canvas.getContext("2d");
  const image = new Image();

  image.src = imgSrc;

  image.onload = function () {
    context.drawImage(image, x, y, 512, 512);
  };
};
