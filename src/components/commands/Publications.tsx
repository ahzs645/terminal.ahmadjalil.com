import { useEffect, useState } from "react";
import { Wrapper } from "../styles/Output.styled";
import { EduIntro, EduList } from "../styles/Education.styled";
import { getCVData, CVData } from "../../utils/cvData";

const Publications: React.FC = () => {
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
      <Wrapper data-testid="publications">
        <EduIntro>Loading publications...</EduIntro>
      </Wrapper>
    );
  }

  const publicationsData = cvData?.cv?.sections?.publications || [];

  return (
    <Wrapper data-testid="publications">
      <EduIntro>Here are my publications!</EduIntro>
      {publicationsData.map((pub, index) => {
        const title = pub.title;
        const desc = `${pub.journal} | ${pub.date}`;
        
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

export default Publications;
