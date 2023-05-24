import { useState, useRef } from "react";
import PromptInput from "./components/promptInput.js";
import "./App.css";
import ImageCanvas from "./components/imageCanvas.js";

function generateCanvasText(word, canvasRef) {
  const canvas = canvasRef.current;
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  const fontSize = 200;
  const fontFamily = "'BlackHanSans'";
  const text = word;
  const x = 256;
  const y = 256;

  ctx.font = `bold ${fontSize}px ${fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = "black";

  ctx.fillText(text, x, y);

  return canvas.toDataURL("image/png");
}

function App() {
  const [prompt, setPrompt] = useState("");
  const [word, setWord] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedImg, setGeneratedImg] = useState();

  const canvasRef = useRef(null);

  const removeBG = (image) => {
    fetch("http://localhost:7860/sdapi/v1/extra-single-image", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        rembg_model: "u2net",
        image,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const base64Image = data.image;
        setGeneratedImg(`data:image/png;base64,${base64Image}`);
        setGenerating(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setGenerating(false);
      });
  };

  const generateTxt2Img = (dataURL) => {
    fetch("http://localhost:7860/sdapi/v1/txt2img", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        prompt,
        seed: -1,
        sampler: "Euler",
        steps: "20",
        width: 512,
        height: 512,
        alwayson_scripts: {
          controlnet: {
            args: [
              {
                module: "invert (from white bg & black line)",
                input_image: dataURL,
                model: "control_v11p_sd15_lineart [43d4be0d]",
              },
            ],
          },
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const base64Image = data.images[0];
        setGeneratedImg(`data:image/png;base64,${base64Image}`);
        removeBG(base64Image);
      })
      .catch((error) => {
        console.error("Error:", error);
        setGenerating(false);
      });
  };

  const onGenerate = () => {
    setGenerating(true);
    const encodedPng = generateCanvasText(word, canvasRef);
    setGeneratedImg(null);
    generateTxt2Img(encodedPng.split(",")[1]);
  };

  return (
    <div className='App'>
      <ImageCanvas canvasRef={canvasRef} generatedImg={generatedImg} />
      <PromptInput
        prompt={prompt}
        setPrompt={setPrompt}
        onGenerate={onGenerate}
        word={word}
        setWord={setWord}
        generating={generating}
      />
    </div>
  );
}

export default App;
