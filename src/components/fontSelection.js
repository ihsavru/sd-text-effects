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
    <div className='p-5 pb-8 bg-white border border-gray-300 rounded mt-20'>
      <h4 className='font-bold mb-5 text-left text-cyan-700 text-sm'>
        Select Font:
      </h4>
      <div className='grid grid-cols-3 gap-3'>
        {FONTS.map((f) => {
          const isSelected = f.value === font;
          return (
            <StyledText
              className={classnames(
                "w-full h-20 border flex align-middle cursor-pointer text-2xl rounded",
                {
                  "bg-orange-100 border-orange-600 text-orange-600": isSelected,
                  "hover:bg-slate-50": !isSelected,
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
