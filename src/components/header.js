import React from "react";
import { styled } from "styled-components";

const Header = () => {
  return (
    <div className='p-4 fixed w-screen top-0 bg-white border-b border-gray-300'>
      <h2 className="text-l text-cyan-700 font-bold uppercase tracking-wider">Stable Diffusion Text Effects</h2>
    </div>
  );
};

export default Header;
