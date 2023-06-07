import React from "react";
import styled from "styled-components";
import classnames from "classnames";
import { FONTS } from "../constants/fonts";

const StyledText = styled.div`
  font-family: ${(props) => props.font};
`;

const FontSelection = ({ font, setFont }) => {
  return (
    <div className='p-5 pb-8 text-slate-900 bg-white mt-20 relative w-full rounded-lg shadow-md sm:text-sm'>
      <div className='grid grid-cols-3 gap-3'>
        {FONTS.map((f) => {
          const isSelected = f.value === font;
          return (
            <StyledText
              className={classnames(
                "w-full h-20 flex align-middle cursor-pointer text-2xl rounded-lg shadow-md",
                {
                  "bg-slate-100 text-emerald-500": isSelected,
                  "hover:bg-slate-100": !isSelected,
                }
              )}
              onClick={() => setFont(f.value)}
              font={f.value}
            >
              <div className='m-auto'>
                ABC<br></br>abc
              </div>
            </StyledText>
          );
        })}
      </div>
    </div>
  );
};

export default FontSelection;
