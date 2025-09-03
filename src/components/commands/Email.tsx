import { useContext, useEffect, useState } from "react";
import _ from "lodash";
import { Wrapper } from "../styles/Output.styled";
import { termContext } from "../Terminal";
import { getCVData, CVData } from "../../utils/cvData";

const Email: React.FC = () => {
  const { history, rerender } = useContext(termContext);
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [emailOpened, setEmailOpened] = useState(false);

  /* ===== get current command ===== */
  const currentCommand = _.split(history[0], " ");

  // Load CV data
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getCVData();
        setCvData(data);
        console.log('Email component CV data:', data?.cv?.email); // Debug log
      } catch (error) {
        console.error('Failed to load CV data in Email component:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const email = cvData?.cv?.email || "contact@example.com";

  // Open email only once when data is loaded and rerender is true
  useEffect(() => {
    if (rerender && currentCommand[0] === "email" && currentCommand.length <= 1 && !isLoading && !emailOpened) {
      console.log('Opening email to:', email);
      window.open("mailto:" + email, "_self");
      setEmailOpened(true);
    }
  }, [rerender, currentCommand, isLoading, email, emailOpened]);

  if (isLoading) {
    return (
      <Wrapper>
        <span>Loading email...</span>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <span>{email}</span>
    </Wrapper>
  );
};

export default Email;
