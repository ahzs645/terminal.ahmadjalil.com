import React, { useContext } from "react";
import { Wrapper } from "../styles/Output.styled";
import { Link } from "../styles/Welcome.styled";
import { termContext } from "../Terminal";
import { useTerminalConfig } from "../../hooks/useTerminalConfig";
import _ from "lodash";

const DownloadCV: React.FC = () => {
  const { history, rerender } = useContext(termContext);
  const { fileNames } = useTerminalConfig();
  const currentCommand = _.split(history[0], " ");

  // Use the dynamic PDF file name or fallback to the current file
  const pdfPath = `/${fileNames.pdfFileName}`;
  const fallbackPath = "/Ahmad_Jalil_CV.pdf"; // Fallback to existing file

  React.useEffect(() => {
    if (rerender && currentCommand[0] === "download-cv" && currentCommand.length <= 1) {
      const link = document.createElement("a");
      link.href = pdfPath;
      link.download = fileNames.pdfFileName;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [rerender, pdfPath, fileNames.pdfFileName]);

  return (
    <Wrapper>
      <p>Downloading CV...</p>
      <p>
        If the download doesn't start automatically,{" "}
        <Link 
          href={pdfPath} 
          download={fileNames.pdfFileName}
        >
          click here
        </Link>
        .
      </p>
    </Wrapper>
  );
};

export default DownloadCV;