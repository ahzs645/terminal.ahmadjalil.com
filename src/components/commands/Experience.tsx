import { useContext, useEffect, useState } from "react";
import { Wrapper } from "../styles/Output.styled";
import { EduIntro, EduList } from "../styles/Education.styled";
import { getCVData, CVData, formatDateRange } from "../../utils/cvData";
import { termContext } from "../Terminal";

const Experience: React.FC = () => {
  const { arg } = useContext(termContext);
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

  // Helper function to get the company name, handling show_company_header logic
  const getCompanyName = (currentExp: any, index: number): string => {
    // If show_company_header is false, look backwards for the most recent company with show_company_header !== false
    if (currentExp.show_company_header === false) {
      for (let i = index - 1; i >= 0; i--) {
        if (experienceData[i].company && experienceData[i].company.trim() !== "" && experienceData[i].show_company_header !== false) {
          return experienceData[i].company;
        }
      }
    }
    
    // Default behavior: use current company if available
    if (currentExp.company && currentExp.company.trim() !== "") {
      return currentExp.company;
    }
    
    // Fallback: look backwards for the most recent non-empty company name
    for (let i = index - 1; i >= 0; i--) {
      if (experienceData[i].company && experienceData[i].company.trim() !== "") {
        return experienceData[i].company;
      }
    }
    
    return "Unknown Company";
  };

  // Check if user wants details
  if (arg.length > 0 && arg[0] === "details") {
    // If argument provided, show specific experience details
    if (arg.length > 1) {
      const index = parseInt(arg[1]) - 1;
      if (index >= 0 && index < experienceData.length) {
        const exp = experienceData[index];
        const title = exp.position;
        const company = getCompanyName(exp, index);
        const desc = `${company} | ${exp.location} | ${formatDateRange(exp.start_date, exp.end_date)}`;
        
        return (
          <Wrapper data-testid="experience">
            <EduIntro>Detailed view for position #{index + 1}</EduIntro>
            <EduList>
              <div className="title">{title}</div>
              <div className="desc">{desc}</div>
              {exp.highlights && exp.highlights.length > 0 && (
                <div className="highlights" style={{ marginTop: '0.5rem' }}>
                  {exp.highlights.map((highlight, idx) => (
                    <div key={idx} style={{ 
                      marginLeft: '1rem', 
                      color: '#888', 
                      marginBottom: '0.25rem',
                      fontSize: '0.9rem'
                    }}>
                      • {highlight}
                    </div>
                  ))}
                </div>
              )}
            </EduList>
          </Wrapper>
        );
      } else {
        return (
          <Wrapper data-testid="experience">
            <EduIntro>Invalid position number. Available positions: 1-{experienceData.length}</EduIntro>
          </Wrapper>
        );
      }
    }

    // Show overview with numbers for detailed access
    return (
      <Wrapper data-testid="experience">
        <EduIntro>
          Detailed work experience - use 'experience details [number]' for full details
        </EduIntro>
        {experienceData.map((exp, index) => {
          const title = `${index + 1}. ${exp.position}`;
          const company = getCompanyName(exp, index);
          const desc = `${company} | ${exp.location} | ${formatDateRange(exp.start_date, exp.end_date)}`;
          
          return (
            <EduList key={index}>
              <div className="title">{title}</div>
              <div className="desc">{desc}</div>
            </EduList>
          );
        })}
        <div style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
          Usage: experience details &#60;number&#62; <br />
          eg: experience details 1
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper data-testid="experience">
      <EduIntro>Here is my work experience!</EduIntro>
      {experienceData.map((exp, index) => {
        const title = `${index + 1}. ${exp.position}`;
        const company = getCompanyName(exp, index);
        const desc = `${company} | ${exp.location} | ${formatDateRange(exp.start_date, exp.end_date)}`;
        
        return (
          <EduList key={index}>
            <div className="title">{title}</div>
            <div className="desc">{desc}</div>
          </EduList>
        );
      })}
      {experienceData.length > 0 && (
        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          Use 'experience details &lt;number&gt;' to view detailed information for a specific position.
        </div>
      )}
    </Wrapper>
  );
};

export default Experience;
