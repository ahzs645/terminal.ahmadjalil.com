import yaml from 'js-yaml';
import { config, getGitHubRawUrl } from '../config/environment';

// CV Data Types
export interface CVExperience {
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string;
  show_date_in_position?: boolean;
  show_company_header?: boolean;
  company_date_range?: string;
  spacing_after?: string;
  highlights: string[];
}

export interface CVEducation {
  institution: string;
  area: string;
  degree: string;
  location: string;
  start_date: string;
  end_date: string;
  highlights: string[];
}

export interface CVVolunteer {
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string;
  highlights: string[];
}

export interface CVAward {
  name: string;
  date: string;
  summary: string;
  highlights: string[];
}

export interface CVPresentation {
  name: string;
  summary: string;
  location: string;
  date: string;
}

export interface CVPublication {
  title: string;
  authors: string[];
  journal: string;
  date: string;
  doi: string;
}

export interface CVProfessionalDevelopment {
  name: string;
  location: string;
  date: string;
  summary: string;
}

export interface CVProject {
  name: string;
  date?: string;
  url?: string;
  summary: string;
  highlights: string[];
}

export interface CVSocial {
  network: string;
  username: string;
  url: string;
}

export interface CVData {
  cv: {
    name: string;
    location: string;
    email: string;
    phone: string;
    website: string;
    social?: CVSocial[];
    sections: {
      experience: CVExperience[];
      education: CVEducation[];
      volunteer: CVVolunteer[];
      projects: CVProject[];
      awards: CVAward[];
      presentations: CVPresentation[];
      publications: CVPublication[];
      professional_development: CVProfessionalDevelopment[];
      certifications_and_skills: string[];
    };
  };
}

// Parse YAML content
export const parseCVData = (yamlContent: string): CVData => {
  try {
    return yaml.load(yamlContent) as CVData;
  } catch (error) {
    console.error('Error parsing CV YAML:', error);
    throw new Error('Failed to parse CV data');
  }
};

// Utility function to format dates for display
export const formatDateRange = (startDate: string, endDate: string): string => {
  const formatDate = (date: string): string => {
    if (date === 'present') return 'Present';
    
    // Parse YYYY-MM format
    const [year, month] = date.split('-');
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

// Get CV data from YAML file (this will be loaded at runtime)
let cvDataCache: CVData | null = null;

export const getCVData = async (): Promise<CVData> => {
  if (cvDataCache) {
    return cvDataCache;
  }

  try {
    // Try to fetch from the public directory first (which should contain the pre-fetched YAML)
    let response = await fetch('/Ahmad_Jalil_CV.yaml');
    
    // If that fails and we're in development, try fetching directly from GitHub
    if (!response.ok && import.meta.env.DEV) {
      console.log('Local YAML not found, trying GitHub directly...');
      const githubUrl = getGitHubRawUrl(config.RESUME_REPO, config.RESUME_BRANCH, config.RESUME_FILE_PATH);
      response = await fetch(githubUrl);
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch CV data: ${response.status}`);
    }
    
    const yamlContent = await response.text();
    cvDataCache = parseCVData(yamlContent);
    return cvDataCache;
  } catch (error) {
    console.error('Error loading CV data:', error);
    // Fallback to empty structure if loading fails
    return {
      cv: {
        name: 'Ahmad Jalil',
        location: 'Prince George, BC',
        email: 'me@ahmadjalil.com',
        phone: '+1-778-267-9144',
        website: 'https://ahmadjalil.com',
        sections: {
          experience: [],
          education: [],
          volunteer: [],
          projects: [],
          awards: [],
          presentations: [],
          publications: [],
          professional_development: [],
          certifications_and_skills: []
        }
      }
    };
  }
};
