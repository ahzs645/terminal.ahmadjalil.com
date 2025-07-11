import { useContext, useEffect, useState } from "react";
import { Wrapper } from "../styles/Output.styled";
import { EduIntro, EduList } from "../styles/Education.styled";
import { getCVData, CVData, formatDateRange } from "../../utils/cvData";
import { termContext } from "../Terminal";

const Volunteer: React.FC = () => {
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
      <Wrapper data-testid="volunteer">
        <EduIntro>Loading volunteer experience...</EduIntro>
      </Wrapper>
    );
  }

  const volunteerData = cvData?.cv?.sections?.volunteer || [];

  // Check if user wants details
  if (arg.length > 0 && arg[0] === "details") {
    // If argument provided, show specific volunteer details
    if (arg.length > 1) {
      const index = parseInt(arg[1]) - 1;
      if (index >= 0 && index < volunteerData.length) {
        const vol = volunteerData[index];
        const title = vol.position;
        const desc = `${vol.company} | ${vol.location} | ${formatDateRange(vol.start_date, vol.end_date)}`;
        
        return (
          <Wrapper data-testid="volunteer">
            <EduIntro>Detailed view for volunteer position #{index + 1}</EduIntro>
            <EduList>
              <div className="title">{title}</div>
              <div className="desc">{desc}</div>
              {vol.highlights && vol.highlights.length > 0 && (
                <div className="highlights" style={{ marginTop: '0.5rem' }}>
                  {vol.highlights.map((highlight, idx) => (
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
          <Wrapper data-testid="volunteer">
            <EduIntro>Invalid volunteer position number. Available positions: 1-{volunteerData.length}</EduIntro>
          </Wrapper>
        );
      }
    }

    // Show overview with numbers for detailed access
    return (
      <Wrapper data-testid="volunteer">
        <EduIntro>
          Detailed volunteer experience - use 'volunteer details [number]' for full details
        </EduIntro>
        {volunteerData.length > 0 ? (
          <>
            {volunteerData.map((vol, index) => {
              const title = `${index + 1}. ${vol.position}`;
              const desc = `${vol.company} | ${vol.location} | ${formatDateRange(vol.start_date, vol.end_date)}`;
              
              return (
                <EduList key={index}>
                  <div className="title">{title}</div>
                  <div className="desc">{desc}</div>
                </EduList>
              );
            })}
            <div style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
              Usage: volunteer details &#60;number&#62; <br />
              eg: volunteer details 1
            </div>
          </>
        ) : (
          <div style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
            No volunteer experience data available yet.
          </div>
        )}
      </Wrapper>
    );
  }

  return (
    <Wrapper data-testid="volunteer">
      <EduIntro>Here is my volunteer experience!</EduIntro>
      {volunteerData.map((vol, index) => {
        const title = `${index + 1}. ${vol.position}`;
        const desc = `${vol.company} | ${vol.location} | ${formatDateRange(vol.start_date, vol.end_date)}`;
        
        return (
          <EduList key={index}>
            <div className="title">{title}</div>
            <div className="desc">{desc}</div>
          </EduList>
        );
      })}
      {volunteerData.length > 0 && (
        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          Use 'volunteer details &lt;number&gt;' to view detailed information for a specific position.
        </div>
      )}
    </Wrapper>
  );
};

export default Volunteer;
