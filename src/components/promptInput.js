import classNames from "classnames";
import React from "react";

const PromptInput = ({
  word,
  setWord,
  prompt,
  setPrompt,
  onGenerate,
  generating,
}) => {
  const disabled = generating || !word || !prompt;
  return (
    <div className='absolute h-2 bottom-20 w-full'>
      <input
        type='text'
        value={word}
        onChange={(e) => setWord(e.currentTarget.value)}
        placeholder='Love'
        className='border border-gray-300 px-6 py-3 rounded w-1/6'
      />
      <input
        type='text'
        value={prompt}
        onChange={(e) => setPrompt(e.currentTarget.value)}
        placeholder='metallic balloon'
        className='border border-gray-300 px-6 py-3 rounded w-1/2'
      />
      <button
        className={classNames("px-6 py-3 ml-3 rounded", {
          "text-white": !disabled,
          "text-gray-800": disabled,
          "bg-blue-900": !disabled,
          "bg-slate-300": disabled,
        })}
        onClick={onGenerate}
      >
        Generate
      </button>
    </div>
  );
};

export default PromptInput;
