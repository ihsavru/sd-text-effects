import React from "react";
import styled from "styled-components";
import { PROMPT_STYLES } from "../constants/promptStyles";

const StyledDiv = styled.div`
  height: 300px;
`;

const StyleSelection = ({ prompt, setPrompt }) => {
  return (
    <StyledDiv className='p-5 overflow-scroll h-1/3 pb-8 text-slate-900 bg-white mt-5 relative w-full rounded-lg shadow-md sm:text-sm'>
      <div className='grid grid-cols-2 gap-5 overflow-scroll'>
        {PROMPT_STYLES.map((p) => {
          return (
            <div
              className='w-full m-auto bg-white h-28 w-28 flex align-baseline justify-center cursor-pointer text-2xl rounded-lg shadow-md'
              onClick={() => setPrompt(p.value)}
            >
              <img className='h-full w-auto' src={p.img}></img>
            </div>
          );
        })}
      </div>
    </StyledDiv>
  );
};

export default StyleSelection;
