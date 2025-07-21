import { UsageDiv } from "./styles/Output.styled";

type Props = {
  cmd: "themes" | "projects" | "socials";
  marginY?: boolean;
};

const arg = {
  themes: { placeholder: "theme-name", example: "ubuntu" },
  projects: { placeholder: "project-no", example: "4" },
  socials: { placeholder: "social-no", example: "1" },
};

const Usage: React.FC<Props> = ({ cmd, marginY = false }) => {
  const action = cmd === "themes" ? "set" : "go";
  const description = cmd === "themes" 
    ? "change the terminal theme" 
    : cmd === "projects" 
    ? "view project details or visit project link"
    : "visit social media profile";
    
  return (
    <UsageDiv data-testid={`${cmd}-invalid-arg`} marginY={marginY}>
      Use '{cmd} {action} &lt;{arg[cmd].placeholder}&gt;' to {description}.
    </UsageDiv>
  );
};

export default Usage;
