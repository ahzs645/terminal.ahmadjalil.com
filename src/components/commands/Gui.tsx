import { useContext, useEffect, useState } from "react";
import _ from "lodash";
import { termContext } from "../Terminal";
import { getCVData, CVData } from "../../utils/cvData";

const Gui: React.FC = () => {
  const { history, rerender } = useContext(termContext);
  const [cvData, setCvData] = useState<CVData | null>(null);

  /* ===== get current command ===== */
  const currentCommand = _.split(history[0], " ");

  // Load CV data
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getCVData();
        setCvData(data);
        console.log('Gui component CV data:', data.cv.website); // Debug log
      } catch (error) {
        console.error('Failed to load CV data in Gui component:', error);
      }
    };

    loadData();
  }, []);

  const website = cvData?.cv?.website || "https://FALLBACK.example.com";

  /* ===== check current command makes redirect ===== */
  if (rerender && currentCommand[0] === "gui") {
    window.open(website, "_blank");
  }

  return <span></span>;
};

export default Gui;
