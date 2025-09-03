import {
  Cmd,
  HeroContainer,
  Link,
  PreImg,
  PreName,
  PreNameMobile,
  PreWrapper,
  Seperator,
} from "../styles/Welcome.styled";
import { useTerminalConfig } from "../../hooks/useTerminalConfig";

const Welcome: React.FC = () => {
  const { config } = useTerminalConfig();
  
  return (
    <HeroContainer data-testid="welcome">
      <div className="info-section">
        <PreName>
          {`
         888                         .d8888b.      d8888  888888888  
         888                        d88P  Y88b    d8P888  888        
         888                        888          d8P 888  888        
 8888b.  88888b.  88888888 .d8888b  888d888b.   d8P  888  8888888b.  
    "88b 888 "88b    d88P  88K      888P "Y88b d88   888       "Y88b 
.d888888 888  888   d88P   "Y8888b. 888    888 8888888888        888 
888  888 888  888  d88P         X88 Y88b  d88P       888  Y88b  d88P 
"Y888888 888  888 88888888  88888P'  "Y8888P"        888   "Y8888P"  
                                                                `}
        </PreName>
        <PreWrapper>
          <PreNameMobile>
            {`
██    ▄  █ █▀▄▀█ ██   ██▄   
█ █  █   █ █ █ █ █ █  █  █  
█▄▄█ ██▀▀█ █ ▄ █ █▄▄█ █   █ 
█  █ █   █ █   █ █  █ █  █  
   █    █     █     █ ███▀  
  █    ▀     ▀     █        
 ▀                ▀         
  ▄▄▄▄▄ ██   █    ▄█ █      
▄▀  █   █ █  █    ██ █      
    █   █▄▄█ █    ██ █      
 ▄ █    █  █ ███▄ ▐█ ███▄   
  ▀        █     ▀ ▐     ▀  
          █                 
         ▀                  
          `}
          </PreNameMobile>
        </PreWrapper>
        <div>Welcome to my terminal portfolio. (Version {config.version})</div>
        <Seperator>----</Seperator>
        <div>
          This project's source code can be found in this project's{" "}
          <Link href={config.repositoryUrl}>
            GitHub repo
          </Link>
          .
        </div>
        <Seperator>----</Seperator>
        <div>
          For a list of available commands, type `<Cmd>help</Cmd>`.
        </div>
      </div>
    </HeroContainer>
  );
};

export default Welcome;
