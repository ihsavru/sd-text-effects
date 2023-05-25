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
    <div className='p-5 bg-white border mt-20 mr-10'>
      <h4 className='bold'>Select Font</h4>
      <div className='grid grid-cols-3 gap-5'>
        {FONTS.map((font) => {
          return (
            <StyledText
              className='w-20 h-20 border cursor-pointer text-2xl m-auto'
              onClick={() => setFont(font.value)}
              font={font.value}
            >
              ABC<br></br>abc
            </StyledText>
          );
        })}
      </div>
    </div>
  );
};

export default FontSelection;
