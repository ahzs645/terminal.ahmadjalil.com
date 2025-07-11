import { useContext, useEffect, useState } from "react";
import { Wrapper } from "../styles/Output.styled";
import { EduIntro, EduList } from "../styles/Education.styled";
import { getCVData, CVData } from "../../utils/cvData";
import { termContext } from "../Terminal";

const Awards: React.FC = () => {
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
      <Wrapper data-testid="awards">
        <EduIntro>Loading awards and achievements...</EduIntro>
      </Wrapper>
    );
  }

  const awardsData = cvData?.cv?.sections?.awards || [];

  const formatDate = (date: string): string => {
    if (!date) return '';
    
    // Parse YYYY-MM format
    const [year, month] = date.split('-');
    if (!month) return year;
    
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  // Check if user wants details
  if (arg.length > 0 && arg[0] === "details") {
    // If argument provided, show specific award details
    if (arg.length > 1) {
      const index = parseInt(arg[1]) - 1;
      if (index >= 0 && index < awardsData.length) {
        const award = awardsData[index];
        const title = award.name;
        const desc = `${award.summary} | ${formatDate(award.date)}`;
        
        return (
          <Wrapper data-testid="awards">
            <EduIntro>Detailed view for award #{index + 1}</EduIntro>
            <EduList>
              <div className="title">{title}</div>
              <div className="desc">{desc}</div>
              {award.highlights && award.highlights.length > 0 && (
                <div className="highlights" style={{ marginTop: '0.5rem' }}>
                  {award.highlights.map((highlight, idx) => (
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
          <Wrapper data-testid="awards">
            <EduIntro>Invalid award number. Available awards: 1-{awardsData.length}</EduIntro>
          </Wrapper>
        );
      }
    }

    // Show overview with numbers for detailed access
    return (
      <Wrapper data-testid="awards">
        <EduIntro>
          Detailed awards information - use 'awards details [number]' for full details
        </EduIntro>
        {awardsData.map((award, index) => {
          const title = `${index + 1}. ${award.name}`;
          const desc = `${award.summary} | ${formatDate(award.date)}`;
          
          return (
            <EduList key={index}>
              <div className="title">{title}</div>
              <div className="desc">{desc}</div>
            </EduList>
          );
        })}
        <div style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
          Usage: awards details &#60;number&#62; <br />
          eg: awards details 1
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper data-testid="awards">
      <EduIntro>Here are my awards and achievements!</EduIntro>
      {awardsData.map((award, index) => {
        const title = `${index + 1}. ${award.name}`;
        const desc = `${award.summary} | ${formatDate(award.date)}`;
        
        return (
          <EduList key={index}>
            <div className="title">{title}</div>
            <div className="desc">{desc}</div>
          </EduList>
        );
      })}
      {awardsData.length > 0 && (
        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          Use 'awards details &lt;number&gt;' to view detailed information for a specific award.
        </div>
      )}
    </Wrapper>
  );
};

export default Awards;
