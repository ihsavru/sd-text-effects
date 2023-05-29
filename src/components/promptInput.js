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
    <div className='absolute h-15 bottom-10 w-full flex justify-between'>
      <input
        type='text'
        value={word}
        onChange={(e) => setWord(e.currentTarget.value)}
        placeholder='Text'
        className='border border-gray-300 px-6 py-3 rounded w-2/12'
      />
      <input
        type='text'
        value={prompt}
        onChange={(e) => setPrompt(e.currentTarget.value)}
        placeholder='metallic balloon'
        className='border border-gray-300 px-6 py-3 rounded w-8/12'
      />
      <button
        className={classNames("px-6 py-3 rounded uppercase tracking-wide font-bold", {
          "text-white bg-cyan-700": !disabled,
          "text-cyan-800 bg-slate-300 cursor-not-allowed": disabled,
        })}
        onClick={onGenerate}
      >
        Generate
      </button>
    </div>
  );
};

export default PromptInput;
