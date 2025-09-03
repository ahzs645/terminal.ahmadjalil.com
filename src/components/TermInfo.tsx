import { User, WebsiteName, Wrapper } from "./styles/TerminalInfo.styled";
import { useTerminalConfig } from "../hooks/useTerminalConfig";

const TermInfo = () => {
  const { config } = useTerminalConfig();
  
  return (
    <Wrapper>
      <User>{config.username}</User>@<WebsiteName>{config.hostname}</WebsiteName>:~$
    </Wrapper>
  );
};

export default TermInfo;
