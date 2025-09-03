import About from "./commands/About";
import Clear from "./commands/Clear";
import CV from "./commands/CV";
import DownloadCV from "./commands/DownloadCV";
import Echo from "./commands/Echo";
import Education from "./commands/Education";
import Experience from "./commands/Experience";
import Awards from "./commands/Awards";
import Publications from "./commands/Publications";
import Volunteer from "./commands/Volunteer";
import ProfessionalDevelopment from "./commands/ProfessionalDevelopment";
import Email from "./commands/Email";
import GeneralOutput from "./commands/GeneralOutput";
import Gui from "./commands/Gui";
import Help from "./commands/Help";
import Welcome from "./commands/Welcome";
import History from "./commands/History";
import Projects from "./commands/Projects";
import Socials from "./commands/Socials";
import Themes from "./commands/Themes";
import { OutputContainer, UsageDiv } from "./styles/Output.styled";
import { termContext } from "./Terminal";
import { useContext } from "react";
import { useCommandsContext } from "../contexts/CommandsContext";
import { useTerminalConfig } from "../hooks/useTerminalConfig";

type Props = {
  index: number;
  cmd: string;
};

const Output: React.FC<Props> = ({ index, cmd }) => {
  const { arg } = useContext(termContext);
  const { commands } = useCommandsContext();
  const { config } = useTerminalConfig();

  // Check if the command is available
  const isCommandAvailable = commands.some(command => command.cmd === cmd);
  
  if (!isCommandAvailable) {
    return <UsageDiv data-testid="usage-output">Command '{cmd}' not found</UsageDiv>;
  }

  const specialCmds = ["projects", "socials", "themes", "echo", "experience", "awards", "volunteer", "education", "professional"];

  // return 'Usage: <cmd>' if command arg is not valid
  // eg: about tt
  if (!specialCmds.includes(cmd) && arg.length > 0)
    return <UsageDiv data-testid="usage-output">Usage: {cmd}</UsageDiv>;

  return (
    <OutputContainer data-testid={index === 0 ? "latest-output" : null}>
      {
        {
          about: <About />,
          awards: <Awards />,
          clear: <Clear />,
          cv: <CV />,
          "download-cv": <DownloadCV />,
          echo: <Echo />,
          education: <Education />,
          email: <Email />,
          experience: <Experience />,
          gui: <Gui />,
          help: <Help />,
          history: <History />,
          professional: <ProfessionalDevelopment />,
          projects: <Projects />,
          publications: <Publications />,
          pwd: <GeneralOutput>{config.homeDirectory}</GeneralOutput>,
          socials: <Socials />,
          themes: <Themes />,
          volunteer: <Volunteer />,
          welcome: <Welcome />,
          whoami: <GeneralOutput>{config.username}</GeneralOutput>,
        }[cmd]
      }
    </OutputContainer>
  );
};

export default Output;
