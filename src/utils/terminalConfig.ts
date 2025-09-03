import { CVData } from './cvData';

// Terminal configuration that can be derived from CV data
export interface TerminalConfig {
  username: string;
  hostname: string;
  homeDirectory: string;
  repositoryUrl: string;
  version: string;
}

// Default terminal configuration
const defaultConfig: TerminalConfig = {
  username: 'visitor',
  hostname: 'terminal.ahmadjalil.com',
  homeDirectory: '/home/user',
  repositoryUrl: 'https://github.com/ahzs645/terminal.ahmadjalil.com',
  version: '1.3.1'
};

// Generate terminal configuration based on CV data
export const generateTerminalConfig = (cvData: CVData | null): TerminalConfig => {
  if (!cvData) {
    return defaultConfig;
  }

  const firstName = cvData.cv.name?.split(' ')[0]?.toLowerCase() || 'user';
  const domain = cvData.cv.website ? 
    new URL(cvData.cv.website).hostname : 
    defaultConfig.hostname;

  return {
    username: defaultConfig.username, // Keep as visitor for now
    hostname: `terminal.${domain}`,
    homeDirectory: `/home/${firstName}`,
    repositoryUrl: defaultConfig.repositoryUrl, // Could be made configurable later
    version: defaultConfig.version
  };
};

// Generate file names based on CV data
export const generateFileNames = (cvData: CVData | null) => {
  if (!cvData?.cv?.name) {
    return {
      pdfFileName: 'CV.pdf',
      yamlFileName: 'CV.yaml'
    };
  }

  const nameForFile = cvData.cv.name.replace(/\s+/g, '_');
  return {
    pdfFileName: `${nameForFile}_CV.pdf`,
    yamlFileName: `${nameForFile}_CV.yaml`
  };
};
