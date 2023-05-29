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
  return (
    <div className='text-center mt-20'>
      <StyledDiv className='w-full flex h-full rounded bg-white border border-gray-300'>
        <StyledCanvas ref={canvasRef} font={font}>
          <span className='self-center'>{word}</span>
        </StyledCanvas>
      </StyledDiv>
    </div>
  );
};

export default ImageCanvas;
