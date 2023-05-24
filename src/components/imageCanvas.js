import React from "react";
import styled from "styled-components";
import classnames from "classnames";

const StyledImg = styled.img`
  width: 512px;
  height: 512px;
`;

const ImageCanvas = ({ canvasRef, generatedImg }) => {
  return (
    <div className='w-full flex justify-around mt-20'>
      <StyledImg
        src={generatedImg}
        className={classnames("border border-gray-300 rounded", {
          hidden: !generatedImg,
        })}
      ></StyledImg>
      <canvas
        ref={canvasRef}
        width={512}
        height={512}
        className={classnames("border border-gray-300 rounded", {
          hidden: generatedImg,
        })}
      />
    </div>
  );
};

export default ImageCanvas;
