import {
  AboutWrapper,
  HighlightAlt,
  HighlightSpan,
} from "../styles/About.styled";

const About: React.FC = () => {
  return (
    <AboutWrapper data-testid="about">
      <p>
        Hi, my name is <HighlightSpan>Ahmad Jalil</HighlightSpan>!
      </p>
      <p>
        I'm <HighlightAlt>a Researcher</HighlightAlt> based in Prince George,
        British Columbia.
      </p>
      <p>
        I am passionate about research and <br />
        tinkering to solve real-life challenges.
      </p>
    </AboutWrapper>
  );
};

export default About;
