import React from "react";
import styled from "styled-components";

const StyledCanvas = styled.canvas`
  font-family: ${(props) => props.font};
  width: inherit;
`;

const StyledDiv = styled.div`
  height: 400px;
`;

const ImageCanvas = ({ word, font, canvasRef }) => {
  const downloadImage = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    const downloadLink = document.createElement("a");
    downloadLink.href = dataURL;
    downloadLink.download = `${word}.png`;
    downloadLink.click();
  };

  return (
    <div className='text-center mt-20 relative'>
      <StyledDiv className='w-full flex h-full rounded bg-white border border-gray-300'>
        <button
          className='absolute top-5 right-5 rounded bg-cyan-700 font-bold uppercase text-sm px-3 py-2 text-white'
          onClick={downloadImage}
        >
          Download Image
        </button>
        <StyledCanvas ref={canvasRef} font={font}>
          <span className='self-center'>{word}</span>
        </StyledCanvas>
      </StyledDiv>
    </div>
  );
};

export default ImageCanvas;
