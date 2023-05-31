import { useState, useRef, useEffect } from "react";
import PromptInput from "./components/promptInput.js";
import "./App.css";
import ImageCanvas from "./components/imageCanvas.js";
import FontSelection from "./components/fontSelection.js";
import Header from "./components/header.js";
import { createTextMask, createText, drawImage } from "./utils/canvas.js";
import { NEGATIVE_PROMPT } from "./constants/promptModifiers.js";
import ModelSelection from "./components/modelSelection.js";

function App() {
  const [prompt, setPrompt] = useState("");
  const [word, setWord] = useState("");
  const [generating, setGenerating] = useState(false);
  const [font, setFont] = useState("Kanit");

  const [selectedModel, setSelectedModel] = useState("");
  const [models, setModels] = useState([]);

  const loadModels = (modelCkpt) => {
    fetch("http://localhost:7860/sdapi/v1/sd-models", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setModels(data);
        setSelectedModel(data.find((m) => m.title === modelCkpt));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const getConfig = () => {
    fetch("http://localhost:7860/sdapi/v1/options", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        loadModels(data.sd_model_checkpoint);
      });
  };

  useEffect(() => {
    getConfig();
  }, []);

  const canvasRef = useRef();

  const generateTextEffect = (img) => {
    const length = word.length;

    const canvas = canvasRef.current;
    canvas.width = 512 * length;
    canvas.height = 512;

    const controlImgSize = 512;
    const fontSize = 500;

    for (let i = 0; i < word.length; i++) {
      createTextMask(img, font, word[i], fontSize)
        .then((dataURL) => {
          const inputImg = dataURL.split(",")[1];
          const control = createText(
            controlImgSize,
            fontSize,
            font,
            word[i]
          ).split(",")[1];
          generateImg2Img(inputImg, control, i);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const generateImg2Img = (inputImg, control, i) => {
    fetch("http://localhost:7860/sdapi/v1/img2img", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        prompt: `${prompt}, white background`,
        negative_prompt: NEGATIVE_PROMPT,
        seed: -1,
        init_images: [inputImg],
        sampler_index: "DPM++ SDE Karras",
        steps: 20,
        width: 512,
        height: 512,
        alwayson_scripts: {
          controlnet: {
            args: [
              {
                module: "invert (from white bg & black line)",
                input_image: control,
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
        const imgSrc = `data:image/png;base64,${base64Image}`;
        const x = 512 * i;
        drawImage(canvasRef, imgSrc, x, 0);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setGenerating(false);
      });
  };

  const generateTxt2Img = (prompt) => {
    fetch("http://localhost:7860/sdapi/v1/txt2img", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        prompt: `${prompt}`,
        negative_prompt: NEGATIVE_PROMPT,
        seed: -1,
        sampler_index: "DPM++ SDE Karras",
        steps: 20,
        width: 512,
        height: 512,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const base64Image = data.images[0];
        generateTextEffect(`data:image/png;base64,${base64Image}`);
      })
      .catch((error) => {
        console.error("Error:", error);
        setGenerating(false);
      });
  };

  const onGenerate = () => {
    if (word && prompt && !generating) {
      setGenerating(true);
      generateTxt2Img(prompt);
      canvasRef.current.innerHTML = "";
    }
  };

  const onSelectModel = (model) => {
    fetch("http://localhost:7860/sdapi/v1/options", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sd_model_checkpoint: model.title,
      }),
    }).then(() => {
      setSelectedModel(model);
    });
  };

  return (
    <div className='App bg-gray-900'>
      <Header />
      <div className='flex justify-between h-screen gap-10'>
        <div className='relative text-center w-3/4 ml-10'>
          <ImageCanvas word={word} font={font} canvasRef={canvasRef} />
          <PromptInput
            prompt={prompt}
            setPrompt={setPrompt}
            onGenerate={onGenerate}
            word={word}
            setWord={setWord}
            generating={generating}
          />
        </div>
        <div className='w-1/4 mr-10'>
          <FontSelection font={font} setFont={setFont}></FontSelection>
          <ModelSelection
            selectedModel={selectedModel}
            onSelectModel={onSelectModel}
            models={models}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
