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
        className='rounded-lg shadow-md bg-white text-slate-900 outline-emerald-400 px-6 py-3 rounded w-1/6'
      />
      <input
        type='text'
        value={prompt}
        onChange={(e) => setPrompt(e.currentTarget.value)}
        placeholder='metallic balloon'
        className='px-6 py-3 rounded-lg shadow-md bg-white text-slate-900 outline-emerald-400 w-4/6'
      />
      <button
        className={classNames(
          "px-6 py-3 rounded-lg shadow-md tracking-wide font-bold",
          {
            "text-white bg-emerald-500 hover:bg-emerald-300 ": !disabled,
            "text-white bg-slate-200 cursor-not-allowed": disabled,
          }
        )}
        onClick={onGenerate}
      >
        Generate
      </button>
    </div>
  );
};

export default PromptInput;
