import { useState, useRef, useEffect } from "react"
import PromptInput from "./components/promptInput.js"
import "./App.css"
import ImageCanvas from "./components/imageCanvas.js"
import FontSelection from "./components/fontSelection.js"
import Header from "./components/header.js"
import {
  createText,
  drawImage,
  createTextMask,
  clearCanvas,
} from "./utils/canvas.js"
import { NEGATIVE_PROMPT } from "./constants/promptModifiers.js"
import ModelSelection from "./components/modelSelection.js"
import StyleSelection from "./components/styleSelection.js"
import ProgressBar from "./components/progressBar.js"

function App() {
  const [prompt, setPrompt] = useState("")
  const [word, setWord] = useState("")
  const [generating, setGenerating] = useState(false)
  const [font, setFont] = useState("Kanit")

  const [selectedModel, setSelectedModel] = useState("")
  const [models, setModels] = useState([])
  const [progressValue, setProgressValue] = useState(0)
  const [progressMax, setProgressMax] = useState(0)

  const loadModels = (modelCkpt) => {
    fetch("http://localhost:7861/sdapi/v1/sd-models", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setModels(data)
        setSelectedModel(data.find((m) => m.title === modelCkpt))
      })
      .catch((error) => {
        console.error("Error:", error)
      })
  }

  const getConfig = () => {
    fetch("http://localhost:7861/sdapi/v1/options", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        loadModels(data.sd_model_checkpoint)
      })
  }

  useEffect(() => {
    getConfig()
  }, [])

  const canvasRef = useRef()

  const generateTextEffect = () => {
    generateTxt2Img(prompt).then((data) => {
      const base64Image = data.images[0]
      setProgressValue((prevProgress) => prevProgress + 1)

      const length = word.length

      const canvas = canvasRef.current
      canvas.width = 300 * length
      canvas.height = 512

      const width = 300
      const height = 512
      const fontSize = 360

      const masksPromises = []
      const reqPromises = []

      const img = `data:image/png;base64,${base64Image}`

      for (let i = 0; i < word.length; i++) {
        masksPromises.push(
          createTextMask(width, height, img, font, word[i], fontSize)
            .then((dataURL) => {
              const x = width * i
              drawImage(
                canvasRef,
                img,
                x,
                0,
                width,
                height,
                fontSize,
                font,
                word[i]
              )
              const inputImg = dataURL.split(",")[1]
              const control = createText(
                width,
                height,
                fontSize,
                font,
                word[i],
                "#000000"
              )
              const mask = createText(
                width,
                height,
                fontSize,
                font,
                word[i],
                "#000000",
              )
              reqPromises.push(
                generateImg2Img(inputImg, control, mask, i, word[i])
              )
            })
            .catch((error) => {
              console.error(error)
            })
        )
      }

      Promise.all(masksPromises).then(() => {
        Promise.all(reqPromises).then(() => {
          setGenerating(false)
        })
      })
    })
  }

  const generateImg2Img = (inputImg, control, mask, i, letter) => {
    return fetch("http://localhost:7861/sdapi/v1/img2img", {
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
        sampler_name: "Euler",
        scheduler: "Kerras",
        steps: 20,
        width: 300,
        height: 512,
        cfg_scale: 7,
        mask: control,
        inpainting_mask_invert: 1,
        mask_blur: 20,
        inpainting_fill: 1,
        inpaint_full_res: true,
        inpaint_full_res_padding: 30,
        alwayson_scripts: {
          controlnet: {
            args: [
              {
                enabled: true,
                module: "invert (from white bg & black line)",
                image: control,
                model: "ControlNet v11p sd15 lineart",
                pixel_perfect: false,
                low_vram: true,
              },
            ],
          },
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const base64Image = data.images[0]
        const imgSrc = `data:image/png;base64,${base64Image}`
        const width = 300
        const height = 512
        const x = width * i
        const fontSize = 360
        setProgressValue((prevProgress) => prevProgress + 1)
        drawImage(
          canvasRef,
          imgSrc,
          x,
          0,
          width,
          height,
          fontSize,
          font,
          letter,
          false
        )
      })
      .catch((error) => {
        console.error("Error:", error)
      })
  }

  const generateTxt2Img = (prompt) => {
    return fetch("http://localhost:7861/sdapi/v1/txt2img", {
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
        sampler_index: "DPM++ 2MSDE",
        steps: 20,
        width: 512,
        height: 512,
      }),
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error:", error)
        setGenerating(false)
      })
  }

  const onGenerate = () => {
    if (word && prompt && !generating) {
      setGenerating(true)
      setProgressValue(0)
      setProgressMax(word.length + 1)
      generateTextEffect()
      clearCanvas(canvasRef)
    }
  }

  const onSelectModel = (model) => {
    fetch("http://localhost:7861/sdapi/v1/options", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sd_model_checkpoint: model.title,
      }),
    }).then(() => {
      setSelectedModel(model)
    })
  }

  return (
    <div className='App bg-slate-100'>
      <Header />
      <div className='flex justify-between h-screen gap-10'>
        <div className='relative text-center w-3/4 ml-10'>
          <ImageCanvas
            word={word}
            font={font}
            canvasRef={canvasRef}
            generating={generating}
          />
          {generating && (
            <ProgressBar
              value={progressValue}
              max={progressMax}
              label='Generating...'
            />
          )}
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
          <StyleSelection
            prompt={prompt}
            setPrompt={setPrompt}
          ></StyleSelection>
        </div>
      </div>
    </div>
  )
}

export default App
