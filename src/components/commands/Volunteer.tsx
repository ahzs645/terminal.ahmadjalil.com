import { useEffect, useState } from "react";
import { Wrapper } from "../styles/Output.styled";
import { EduIntro, EduList } from "../styles/Education.styled";
import { getCVData, CVData, formatDateRange } from "../../utils/cvData";

const Volunteer: React.FC = () => {
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

  return (
    <Wrapper data-testid="volunteer">
      <EduIntro>Here is my volunteer experience!</EduIntro>
      {volunteerData.map((vol, index) => {
        const title = vol.position;
        const desc = `${vol.company} | ${vol.location} | ${formatDateRange(vol.start_date, vol.end_date)}`;
        
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

export default Volunteer;
