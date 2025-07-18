import React, { useContext } from "react";
import { Wrapper } from "../styles/Output.styled";
import { Link } from "../styles/Welcome.styled";
import { termContext } from "../Terminal";
import _ from "lodash";

const DownloadCV: React.FC = () => {
  const { history, rerender } = useContext(termContext);
  const currentCommand = _.split(history[0], " ");

  React.useEffect(() => {
    if (rerender && currentCommand[0] === "download-cv" && currentCommand.length <= 1) {
      const link = document.createElement("a");
      link.href = "/Ahmad_Jalil_CV.pdf";
      link.download = "Ahmad_Jalil_CV.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [rerender]);

  return (
    <Wrapper>
      <p>Downloading CV...</p>
      <p>
        If the download doesn't start automatically,{" "}
        <Link 
          href="/Ahmad_Jalil_CV.pdf" 
          download
        >
          click here
        </Link>
        .
      </p>
    </Wrapper>
  );
};

export default DownloadCV;