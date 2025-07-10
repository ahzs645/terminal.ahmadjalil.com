import { useEffect, useState } from "react";
import { Wrapper } from "../styles/Output.styled";
import { EduIntro, EduList } from "../styles/Education.styled";
import { getCVData, CVData, formatDateRange } from "../../utils/cvData";

const Experience: React.FC = () => {
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCVData = async () => {
      try {
        const data = await getCVData();
        setCvData(data);
      } catch (error) {
        console.error('Failed to load CV data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCVData();
  }, []);

  if (loading) {
    return (
      <Wrapper data-testid="experience">
        <EduIntro>Loading work experience...</EduIntro>
      </Wrapper>
    );
  }

  const experienceData = cvData?.cv?.sections?.experience || [];

  // Helper function to get the company name, using previous company if current is empty
  const getCompanyName = (currentExp: any, index: number): string => {
    if (currentExp.company && currentExp.company.trim() !== "") {
      return currentExp.company;
    }
    
    // Look backwards for the most recent non-empty company name
    for (let i = index - 1; i >= 0; i--) {
      if (experienceData[i].company && experienceData[i].company.trim() !== "") {
        return experienceData[i].company;
      }
    }
    
    return "Unknown Company";
  };

  return (
    <Wrapper data-testid="experience">
      <EduIntro>Here is my work experience!</EduIntro>
      {experienceData.map((exp, index) => {
        const title = exp.position;
        const company = getCompanyName(exp, index);
        const desc = `${company} | ${exp.location} | ${formatDateRange(exp.start_date, exp.end_date)}`;
        
        return (
          <EduList key={index}>
            <div className="title">{title}</div>
            <div className="desc">{desc}</div>
          </EduList>
        );
      })}
    </Wrapper>
  );
};

export default Experience;
