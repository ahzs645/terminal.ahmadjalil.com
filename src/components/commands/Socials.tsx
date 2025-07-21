import { useContext, useEffect, useState } from "react";
import { ProjectsIntro } from "../styles/Projects.styled";
import { Cmd, CmdDesc, CmdList, HelpWrapper } from "../styles/Help.styled";
import {
  checkRedirect,
  generateTabs,
  getCurrentCmdArry,
  isArgInvalid,
} from "../../utils/funcs";
import { termContext } from "../Terminal";
import Usage from "../Usage";
import { getCVData, CVSocial } from "../../utils/cvData";

const Socials: React.FC = () => {
  const { arg, history, rerender } = useContext(termContext);
  const [socials, setSocials] = useState<CVSocial[]>([]);
  const [loading, setLoading] = useState(true);

  /* ===== get current command ===== */
  const currentCommand = getCurrentCmdArry(history);

  /* ===== Load CV data ===== */
  useEffect(() => {
    const loadSocials = async () => {
      try {
        const cvData = await getCVData();
        setSocials(cvData.cv.social || []);
      } catch (error) {
        console.error("Error loading socials:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSocials();
  }, []);

  /* ===== check current command makes redirect ===== */
  useEffect(() => {
    if (checkRedirect(rerender, currentCommand, "socials")) {
      socials.forEach((social, index) => {
        const socialIndex = index + 1;
        if (socialIndex === parseInt(arg[1]) && social.url) {
          window.open(social.url, "_blank");
        }
      });
    }
  }, [arg, rerender, currentCommand, socials]);

  /* ===== check arg is valid ===== */
  const checkArg = () => {
    const validArgs = socials && socials.length > 0 ? socials.map((_, index) => (index + 1).toString()) : [];
    return isArgInvalid(arg, "go", validArgs) ? (
      <Usage cmd="socials" />
    ) : null;
  };

  if (loading) {
    return <div>Loading socials...</div>;
  }

  return arg.length > 0 || arg.length > 2 ? (
    checkArg()
  ) : (
    <HelpWrapper data-testid="socials">
      <ProjectsIntro>Here are my social links</ProjectsIntro>
      {socials && socials.length > 0 ? (() => {
        // Find the longest social network name for proper alignment
        const maxNetworkLength = Math.max(...socials.map(({ network }) => network.length));
        
        return socials.map((social, index) => {
          // Calculate the number of spaces needed for alignment
          const spacesNeeded = maxNetworkLength - social.network.length + 2; // +2 for extra spacing
          
          return (
            <CmdList key={social.network}>
              <Cmd>{`${index + 1}. ${social.network}`}</Cmd>
              {generateTabs(spacesNeeded)}
              <CmdDesc>- {social.url}</CmdDesc>
            </CmdList>
          );
        });
      })() : (
        <div>No social links found.</div>
      )}
      <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
        Use 'socials go &lt;social-no&gt;' to visit social media profile.
      </div>
    </HelpWrapper>
  );
};

export default Socials;
