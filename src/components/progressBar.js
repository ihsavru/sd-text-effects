import React from "react";
import { styled } from "styled-components";

const StyledProgress = styled.div`
  transition: width 0.3s ease-in-out;
  width: ${(props) => props.progress}%;
`;

const ProgressBar = ({ value, max, label }) => {
  const progress = (value / max) * 100;

  return (
    <>
      <div className='w-full mt-5 bg-gray-100 h-2 rounded'>
        <StyledProgress
          className='rounded bg-pink-500 h-full'
          progress={progress}
        ></StyledProgress>
      </div>
      <span className="text-gray-50">{label || "Please wait..."}</span>
    </>
  );
};

export default ProgressBar;
