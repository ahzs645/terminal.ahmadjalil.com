import {
  Cmd,
  CmdDesc,
  CmdList,
  HelpWrapper,
  KeyContainer,
} from "../styles/Help.styled";
import { commands } from "../Terminal";
import { generateTabs } from "../../utils/funcs";

const Help: React.FC = () => {
  // Find the longest command name to calculate proper alignment
  const maxCmdLength = Math.max(...commands.map(({ cmd }) => cmd.length));
  
  return (
    <HelpWrapper data-testid="help">
      {commands.map(({ cmd, desc }) => {
        // Calculate the number of spaces needed for alignment
        const spacesNeeded = maxCmdLength - cmd.length + 2; // +2 for extra spacing
        
        return (
          <CmdList key={cmd}>
            <Cmd>{cmd}</Cmd>
            {generateTabs(spacesNeeded)}
            <CmdDesc>- {desc}</CmdDesc>
          </CmdList>
        );
      })}
      <KeyContainer>
        <div>Tab or Ctrl + i&nbsp; =&gt; autocompletes the command</div>
        <div>Up Arrow {generateTabs(5)} =&gt; go back to previous command</div>
        <div>Ctrl + l {generateTabs(5)} =&gt; clear the terminal</div>
      </KeyContainer>
    </HelpWrapper>
  );
};

export default Help;
