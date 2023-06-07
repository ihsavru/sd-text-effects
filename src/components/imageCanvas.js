import React, { Fragment } from "react";
import styled from "styled-components";
import { Menu, Transition } from "@headlessui/react";
import { ArrowDownTrayIcon } from "@heroicons/react/20/solid";

const StyledCanvas = styled.canvas`
  font-family: ${(props) => props.font};
  width: inherit;
  max-height: 400px;
  max-width: fit-content;
`;

const StyledDiv = styled.div`
  height: 400px;
`;

const ImageCanvas = ({ word, font, canvasRef }) => {
  const downloadImg = (dataURL) => {
    const downloadLink = document.createElement("a");
    downloadLink.href = dataURL;
    downloadLink.download = `${word}.png`;
    downloadLink.click();
  };

  const handleDownload = (bg = true) => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();

    if (!bg) {
      fetch("http://localhost:7860/sdapi/v1/extra-single-image", {
        method: "POST",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          rembg_model: "u2net",
          image: dataURL.split(",")[1],
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          const base64Image = data.image;
          downloadImg(`data:image/png;base64,${base64Image}`);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      downloadImg(dataURL);
    }
  };

  return (
    <div className='text-center mt-20 relative rounded-lg'>
      <StyledDiv className='w-full flex h-full bg-white rounded-lg shadow-md'>
        <Menu
          as='div'
          className='absolute top-3 right-3 rounded-lg text-xs text-white'
        >
          <div>
            <Menu.Button className='inline-flex w-full justify-center rounded-md bg-emerald-500 px-2 py-1.5 text-sm font-medium text-white hover:bg-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'>
              <ArrowDownTrayIcon className='h-4 w-4' aria-hidden='true' />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
          >
            <Menu.Items className='absolute right-0 mt-2 w-56 origin-top-right divide-y divide-slate-100 rounded-md bg-white text-slate-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
              <div className='px-1 py-1 '>
                <Menu.Item>
                  <button
                    onClick={handleDownload}
                    className={`hover:bg-slate-100 flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    With background
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button
                    onClick={() => handleDownload(false)}
                    className={`hover:bg-slate-100 flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    Without background
                  </button>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
        <StyledCanvas
          className='rounded-lg h-fit m-auto'
          ref={canvasRef}
          font={font}
        >
          <span className='self-center'>{word}</span>
        </StyledCanvas>
      </StyledDiv>
    </div>
  );
};

export default ImageCanvas;
