import React from "react";
import styled from "styled-components";
import classnames from "classnames";

const StyledText = styled.div`
  font-family: ${(props) => props.font};
`;

const FONTS = [
  {
    label: "Archivo",
    value: "Archivo",
  },
  {
    label: "Black Han Sans",
    value: "BlackHanSans",
  },
  {
    label: "Alfa Slab One",
    value: "AlfaSlabOne",
  },
  {
    label: "Kanit",
    value: "Kanit",
  },
  {
    label: "Lilita One",
    value: "LilitaOne",
  },
  {
    label: "Righteous",
    value: "Righteous",
  },
];

const FontSelection = ({ font, setFont }) => {
  return (
    <div className='p-5 pb-8 text-gray-50 bg-gray-800 mt-20 relative w-full rounded-lg shadow-md sm:text-sm'>
      <div className='grid grid-cols-3 gap-3'>
        {FONTS.map((f) => {
          const isSelected = f.value === font;
          return (
            <StyledText
              className={classnames(
                "w-full h-20 flex align-middle cursor-pointer text-2xl rounded-lg shadow-md",
                {
                  "bg-gray-700 text-pink-200": isSelected,
                  "hover:bg-gray-700": !isSelected,
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
