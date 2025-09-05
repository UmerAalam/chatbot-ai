import { useState } from "react";
import { LuCopy } from "react-icons/lu";
import { LuCopyCheck } from "react-icons/lu";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  textToCopy: string;
}
function CopyToClipBoard({ textToCopy, ...rest }: Props) {
  const [isCopied, setIsCopied] = useState(false);
  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };
  return (
    <div
      {...rest}
      onClick={() => {
        if (!isCopied) {
          handleCopyClick();
        }
      }}
    >
      {isCopied ? <LuCopyCheck size={18} /> : <LuCopy size={18} />}
    </div>
  );
}
export default CopyToClipBoard;
