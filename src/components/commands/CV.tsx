import { useEffect, useState } from "react";
import { Wrapper } from "../styles/Output.styled";
import { EduIntro } from "../styles/Education.styled";
import { getCVData, CVData } from "../../utils/cvData";

const CV: React.FC = () => {
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
      <Wrapper data-testid="cv">
        <EduIntro>Loading CV overview...</EduIntro>
      </Wrapper>
    );
  }

  const cv = cvData?.cv;
  if (!cv) {
    return (
      <Wrapper data-testid="cv">
        <EduIntro>Failed to load CV data</EduIntro>
      </Wrapper>
    );
  }

  const sectionCounts = {
    experience: cv.sections.experience?.length || 0,
    education: cv.sections.education?.length || 0,
    volunteer: cv.sections.volunteer?.length || 0,
    awards: cv.sections.awards?.length || 0,
    publications: cv.sections.publications?.length || 0,
    presentations: cv.sections.presentations?.length || 0,
    professional_development: cv.sections.professional_development?.length || 0,
  };

  return (
    <Wrapper data-testid="cv">
      <EduIntro>CV Overview for {cv.name}</EduIntro>
      
      <div style={{ marginTop: '1rem', color: '#888' }}>
        <div><strong>Location:</strong> {cv.location}</div>
        <div><strong>Email:</strong> {cv.email}</div>
        <div><strong>Website:</strong> {cv.website}</div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <div style={{ color: '#ddd', marginBottom: '0.5rem' }}><strong>Available Sections:</strong></div>
        
        <div style={{ marginLeft: '1rem', fontSize: '0.9rem', color: '#888' }}>
          <div>• <span style={{ color: '#aaa' }}>experience</span> - {sectionCounts.experience} work positions</div>
          <div>• <span style={{ color: '#aaa' }}>education</span> - {sectionCounts.education} degrees</div>
          <div>• <span style={{ color: '#aaa' }}>volunteer</span> - {sectionCounts.volunteer} volunteer positions</div>
          <div>• <span style={{ color: '#aaa' }}>awards</span> - {sectionCounts.awards} awards and achievements</div>
          <div>• <span style={{ color: '#aaa' }}>publications</span> - {sectionCounts.publications} published papers</div>
          {sectionCounts.presentations > 0 && (
            <div>• <span style={{ color: '#aaa' }}>presentations</span> - {sectionCounts.presentations} conference presentations</div>
          )}
          {sectionCounts.professional_development > 0 && (
            <div>• <span style={{ color: '#aaa' }}>professional development</span> - {sectionCounts.professional_development} courses completed</div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
        Use any of the section commands above to view detailed information.
        Type 'help' to see all available commands.
      </div>
    </Wrapper>
  );
};

export default CV;
