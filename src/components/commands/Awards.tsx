import { useEffect, useState } from "react";
import { Wrapper } from "../styles/Output.styled";
import { EduIntro, EduList } from "../styles/Education.styled";
import { getCVData, CVData } from "../../utils/cvData";

const Awards: React.FC = () => {
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

  return (
    <Wrapper data-testid="awards">
      <EduIntro>Here are my awards and achievements!</EduIntro>
      {awardsData.map((award, index) => {
        const title = award.name;
        const desc = `${award.summary} | ${formatDate(award.date)}`;
        
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

export default Awards;
