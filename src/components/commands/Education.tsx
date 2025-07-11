import { useContext, useEffect, useState } from "react";
import { EduIntro, EduList } from "../styles/Education.styled";
import { Wrapper } from "../styles/Output.styled";
import { getCVData, CVData, formatDateRange } from "../../utils/cvData";
import { termContext } from "../Terminal";

const Education: React.FC = () => {
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
      <Wrapper data-testid="education">
        <EduIntro>Loading education background...</EduIntro>
      </Wrapper>
    );
  }

  const educationData = cvData?.cv?.sections?.education || [];

  // Check if user wants details
  if (arg.length > 0 && arg[0] === "details") {
    // If argument provided, show specific education details
    if (arg.length > 1) {
      const index = parseInt(arg[1]) - 1;
      if (index >= 0 && index < educationData.length) {
        const edu = educationData[index];
        const title = `${edu.degree} in ${edu.area}`;
        const desc = `${edu.institution} | ${edu.location} | ${formatDateRange(edu.start_date, edu.end_date)}`;
        
        return (
          <Wrapper data-testid="education">
            <EduIntro>Detailed view for education #{index + 1}</EduIntro>
            <EduList>
              <div className="title">{title}</div>
              <div className="desc">{desc}</div>
              {edu.highlights && edu.highlights.length > 0 && (
                <div className="highlights" style={{ marginTop: '0.5rem' }}>
                  {edu.highlights.map((highlight, idx) => (
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
          <Wrapper data-testid="education">
            <EduIntro>Invalid education number. Available education entries: 1-{educationData.length}</EduIntro>
          </Wrapper>
        );
      }
    }

    // Show overview with numbers for detailed access
    return (
      <Wrapper data-testid="education">
        <EduIntro>
          Detailed education background - use 'education details [number]' for full details
        </EduIntro>
        {educationData.length > 0 ? (
          <>
            {educationData.map((edu, index) => {
              const title = `${index + 1}. ${edu.degree} in ${edu.area}`;
              const desc = `${edu.institution} | ${edu.location} | ${formatDateRange(edu.start_date, edu.end_date)}`;
              
              return (
                <EduList key={index}>
                  <div className="title">{title}</div>
                  <div className="desc">{desc}</div>
                </EduList>
              );
            })}
            <div style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
              Usage: education details &#60;number&#62; <br />
              eg: education details 1
            </div>
          </>
        ) : (
          <div style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
            No education data available yet.
          </div>
        )}
      </Wrapper>
    );
  }

  return (
    <Wrapper data-testid="education">
      <EduIntro>Here is my education background!</EduIntro>
      {educationData.map((edu, index) => {
        const title = `${index + 1}. ${edu.degree} in ${edu.area}`;
        const desc = `${edu.institution} | ${edu.location} | ${formatDateRange(edu.start_date, edu.end_date)}`;
        
        return (
          <EduList key={index}>
            <div className="title">{title}</div>
            <div className="desc">{desc}</div>
          </EduList>
        );
      })}
      {educationData.length > 0 && (
        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          Use 'education details &lt;number&gt;' to view detailed information for a specific education entry.
        </div>
      )}
    </Wrapper>
  );
};

export default Education;
