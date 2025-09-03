import { CVData } from './cvData';

// Command mapping to YAML sections
export interface CommandMapping {
  cmd: string;
  desc: string;
  yamlSection?: keyof CVData['cv']['sections'] | 'basic';
  isAlwaysAvailable?: boolean;
}

// Static commands that are always available (don't depend on YAML data)
const staticCommands: CommandMapping[] = [
  { cmd: "clear", desc: "clear the terminal", isAlwaysAvailable: true },
  { cmd: "echo", desc: "print out anything", isAlwaysAvailable: true },
  { cmd: "email", desc: "", yamlSection: "basic" }, // Will use dynamic description
  { cmd: "gui", desc: "go to my portfolio in GUI", isAlwaysAvailable: true },
  { cmd: "help", desc: "check available commands", isAlwaysAvailable: true },
  { cmd: "history", desc: "view command history", isAlwaysAvailable: true },
  { cmd: "pwd", desc: "print current working directory", isAlwaysAvailable: true },
  { cmd: "themes", desc: "check available themes", isAlwaysAvailable: true },
  { cmd: "welcome", desc: "display hero section", isAlwaysAvailable: true },
  { cmd: "whoami", desc: "about current user", isAlwaysAvailable: true },
];

// Commands that depend on YAML data (descriptions will be generated dynamically)
const dynamicCommands: CommandMapping[] = [
  { cmd: "about", desc: "", yamlSection: "basic" },
  { cmd: "awards", desc: "", yamlSection: "awards" },
  { cmd: "cv", desc: "", yamlSection: "basic" },
  { cmd: "download-cv", desc: "", yamlSection: "basic" },
  { cmd: "education", desc: "", yamlSection: "education" },
  { cmd: "experience", desc: "", yamlSection: "experience" },
  { cmd: "professional", desc: "", yamlSection: "professional_development" },
  { cmd: "projects", desc: "", yamlSection: "projects" },
  { cmd: "publications", desc: "", yamlSection: "publications" },
  { cmd: "socials", desc: "", yamlSection: "basic" },
  { cmd: "volunteer", desc: "", yamlSection: "volunteer" },
];

// All possible commands
export const allCommands: CommandMapping[] = [...staticCommands, ...dynamicCommands];

// Function to generate dynamic descriptions based on CV data
const generateDynamicDescription = (cmd: string, cvData: CVData): string => {
  const name = cvData?.cv?.name || "User";
  const firstName = name.split(' ')[0];
  
  switch (cmd) {
    case "about":
      return `about ${name}`;
    case "cv":
      return `view ${firstName}'s CV overview`;
    case "download-cv":
      return `download ${name}'s CV (PDF)`;
    case "socials":
      return `check out ${firstName}'s social accounts`;
    case "email":
      return `send an email to ${firstName}`;
    case "experience":
      return `view ${firstName}'s work experience`;
    case "education":
      return `view ${firstName}'s education background`;
    case "projects":
      return `view projects ${firstName} has coded`;
    case "volunteer":
      return `view ${firstName}'s volunteer experience`;
    case "awards":
      return `view ${firstName}'s awards and achievements`;
    case "publications":
      return `view ${firstName}'s published research papers`;
    case "professional":
      return `view ${firstName}'s professional development`;
    default:
      return "";
  }
};

// Function to check if a YAML section has data
const hasDataInSection = (cvData: CVData, section: keyof CVData['cv']['sections'] | 'basic'): boolean => {
  if (section === 'basic') {
    // Basic sections are always available if we have basic CV data
    return !!(cvData?.cv?.name && cvData?.cv?.email);
  }

  const sectionData = cvData?.cv?.sections?.[section];
  
  if (!sectionData) return false;
  
  // For arrays, check if they have any items
  if (Array.isArray(sectionData)) {
    return sectionData.length > 0;
  }
  
  // For other types, check if they exist and are not empty
  return !!sectionData;
};

// Generate available commands based on CV data
export const generateAvailableCommands = (cvData: CVData | null): CommandMapping[] => {
  const availableCommands: CommandMapping[] = [];

  allCommands.forEach(command => {
    // Always include commands that don't depend on YAML or are marked as always available
    if (command.isAlwaysAvailable) {
      // Generate dynamic description if needed and CV data is available
      const desc = (!command.desc && cvData) ? generateDynamicDescription(command.cmd, cvData) : command.desc;
      availableCommands.push({
        ...command,
        desc: desc || command.desc
      });
    }
    // Include commands if their corresponding YAML section has data
    else if (command.yamlSection && cvData && hasDataInSection(cvData, command.yamlSection)) {
      // Generate dynamic description if needed
      const desc = command.desc || generateDynamicDescription(command.cmd, cvData);
      availableCommands.push({
        ...command,
        desc
      });
    }
    // Include commands without yamlSection requirement
    else if (!command.yamlSection) {
      availableCommands.push(command);
    }
  });

  return availableCommands;
};

// Convert CommandMapping to the format expected by Terminal component
export const convertToTerminalCommands = (commands: CommandMapping[]): Array<{ cmd: string; desc: string }> => {
  return commands.map(({ cmd, desc }) => ({ cmd, desc }));
};
