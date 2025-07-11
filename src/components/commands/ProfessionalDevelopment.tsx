import { useContext, useEffect, useState } from "react";
import { EduIntro, EduList } from "../styles/Education.styled";
import { Wrapper } from "../styles/Output.styled";
import { getCVData, CVData } from "../../utils/cvData";
import { termContext } from "../Terminal";

const ProfessionalDevelopment: React.FC = () => {
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
      <Wrapper data-testid="professional-development">
        <EduIntro>Loading professional development...</EduIntro>
      </Wrapper>
    );
  }

  const professionalDevData = cvData?.cv?.sections?.professional_development || [];

  // Check if user wants details
  if (arg.length > 0 && arg[0] === "details") {
    // If argument provided, show specific professional development details
    if (arg.length > 1) {
      const index = parseInt(arg[1]) - 1;
      if (index >= 0 && index < professionalDevData.length) {
        const course = professionalDevData[index];
        const title = course.name;
        const desc = `${course.summary} | ${course.location} | ${course.date}`;
        
        return (
          <Wrapper data-testid="professional-development">
            <EduIntro>Detailed view for professional development #{index + 1}</EduIntro>
            <EduList>
              <div className="title">{title}</div>
              <div className="desc">{desc}</div>
            </EduList>
          </Wrapper>
        );
      } else {
        return (
          <Wrapper data-testid="professional-development">
            <EduIntro>Invalid professional development number. Available courses: 1-{professionalDevData.length}</EduIntro>
          </Wrapper>
        );
      }
    }

    // Show overview with numbers for detailed access
    return (
      <Wrapper data-testid="professional-development">
        <EduIntro>
          Detailed professional development - use 'professional details [number]' for full details
        </EduIntro>
        {professionalDevData.length > 0 ? (
          <>
            {professionalDevData.map((course, index) => {
              const title = `${index + 1}. ${course.name}`;
              const desc = `${course.summary} | ${course.location} | ${course.date}`;
              
              return (
                <EduList key={index}>
                  <div className="title">{title}</div>
                  <div className="desc">{desc}</div>
                </EduList>
              );
            })}
            <div style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
              Usage: professional details &#60;number&#62; <br />
              eg: professional details 1
            </div>
          </>
        ) : (
          <div style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
            No professional development data available yet.
          </div>
        )}
      </Wrapper>
    );
  }

  return (
    <Wrapper data-testid="professional-development">
      <EduIntro>Here is my professional development!</EduIntro>
      {professionalDevData.map((course, index) => {
        const title = `${index + 1}. ${course.name}`;
        const desc = `${course.summary} | ${course.location} | ${course.date}`;
        
        return (
          <EduList key={index}>
            <div className="title">{title}</div>
            <div className="desc">{desc}</div>
          </EduList>
        );
      })}
      {professionalDevData.length > 0 && (
        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          Use 'professional details &lt;number&gt;' to view detailed information for a specific course.
        </div>
      )}
    </Wrapper>
  );
};

export default ProfessionalDevelopment;
