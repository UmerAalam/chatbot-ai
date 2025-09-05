import React, { useState } from "react";

interface Props {
  addBtn?: (value: string) => void;
  cancelBtn?: () => void;
  isChat: boolean;
}
const AddAlert = ({ addBtn, cancelBtn, isChat = false }: Props) => {
  const [text, setText] = useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };
  return (
    <div className="absolute z-10 top-0 left-0 bg-black/50 w-full h-screen flex items-center justify-center backdrop-blur-2xl">
      <div className="flex flex-col gap-5 items-center justify-center bg-gray-800/20 w-100 h-50 rounded-2xl">
        <div className="flex border-l-10 h-12 border-green-400 items-center justify-start text-white font-bold bg-gray-800/20 rounded-2xl w-[80%]">
          <div className="ml-3">{isChat ? "Chat" : "Folder"}</div>
          <div className="ml-2 border-1 border-gray-500 h-[40%]" />
          <input
            onChange={handleChange}
            className="ml-3 h-10 outline-0"
            placeholder="Enter Name"
          />
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => {
              cancelBtn && cancelBtn();
              setText("");
            }}
            className="w-24 h-10 font-bold bg-white text-gray-800 rounded-2xl hover:bg-red-500 hover:text-white border-2 border-transparent hover:border-white"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (text.trim() === "") return;
              addBtn && addBtn(text);
              setText("");
            }}
            className="w-24 h-10 font-bold bg-green-400 text-green-900 hover:text-white border-2 border-transparent hover:border-white rounded-2xl"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
export default AddAlert;
