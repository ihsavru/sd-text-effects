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
      <div className='w-full mt-5 bg-white h-2 rounded'>
        <StyledProgress
          className='rounded bg-emerald-500 h-full'
          progress={progress}
        ></StyledProgress>
      </div>
      <span className='text-slate-900'>{label || "Please wait..."}</span>
    </>
  );
};

export default ProgressBar;
