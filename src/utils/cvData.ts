import yaml from 'js-yaml';
import { config, getGitHubRawUrl } from '../config/environment';

// CV Data Types
export interface CVPosition {
  title: string;
  start_date: string;
  end_date: string;
  highlights: string[];
}

export interface CVExperience {
  company: string;
  position?: string; // For backward compatibility
  location: string;
  start_date?: string; // For backward compatibility
  end_date?: string; // For backward compatibility
  show_date_in_position?: boolean;
  show_company_header?: boolean;
  company_date_range?: string;
  spacing_after?: string;
  highlights?: string[]; // For backward compatibility
  positions?: CVPosition[]; // New format with multiple positions
  show?: boolean; // Optional field to hide entries
}

export interface CVEducation {
  institution: string;
  area: string;
  degree: string;
  location: string;
  start_date: string;
  end_date: string;
  highlights: string[];
  show?: boolean; // Optional field to hide entries
}

export interface CVVolunteer {
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string;
  highlights: string[];
  show?: boolean; // Optional field to hide entries
  spacing_after?: string;
}

export interface CVAward {
  name: string;
  date: string;
  summary: string;
  highlights: string[];
  show?: boolean; // Optional field to hide entries
}

export interface CVPresentation {
  name: string;
  summary: string;
  location: string;
  date: string;
  show?: boolean; // Optional field to hide entries
}

export interface CVPublication {
  title: string;
  authors: string[];
  journal: string;
  date: string;
  doi: string;
  show?: boolean; // Optional field to hide entries
}

export interface CVProfessionalDevelopment {
  name: string;
  location: string;
  date: string;
  summary: string;
  show?: boolean; // Optional field to hide entries
}

export interface CVProject {
  name: string;
  date?: string;
  url?: string;
  summary: string;
  highlights: string[];
  show?: boolean; // Optional field to hide entries
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

// Utility function to flatten experience data to handle both old and new formats
export const flattenExperienceData = (experiences: CVExperience[]): Array<{
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string;
  highlights: string[];
  show_company_header?: boolean;
  show_date_in_position?: boolean;
  company_date_range?: string;
  spacing_after?: string;
}> => {
  const flattened: Array<{
    company: string;
    position: string;
    location: string;
    start_date: string;
    end_date: string;
    highlights: string[];
    show_company_header?: boolean;
    show_date_in_position?: boolean;
    company_date_range?: string;
    spacing_after?: string;
  }> = [];

  experiences.forEach((exp) => {
    if (exp.positions && exp.positions.length > 0) {
      // New format with positions array
      exp.positions.forEach((position, index) => {
        flattened.push({
          company: exp.company,
          position: position.title,
          location: exp.location,
          start_date: position.start_date,
          end_date: position.end_date,
          highlights: position.highlights,
          show_company_header: index === 0 ? exp.show_company_header : false,
          show_date_in_position: exp.show_date_in_position,
          company_date_range: exp.company_date_range,
          spacing_after: index === exp.positions!.length - 1 ? exp.spacing_after : undefined,
        });
      });
    } else if (exp.position && exp.start_date && exp.end_date) {
      // Old format with individual position
      flattened.push({
        company: exp.company,
        position: exp.position,
        location: exp.location,
        start_date: exp.start_date,
        end_date: exp.end_date,
        highlights: exp.highlights || [],
        show_company_header: exp.show_company_header,
        show_date_in_position: exp.show_date_in_position,
        company_date_range: exp.company_date_range,
        spacing_after: exp.spacing_after,
      });
    }
  });

  return flattened;
};

// Filter function to remove entries with show: false
const filterHiddenEntries = <T extends { show?: boolean }>(entries: T[]): T[] => {
  return entries.filter(entry => entry.show !== false);
};

// Get CV data from YAML file (this will be loaded at runtime)
let cvDataCache: CVData | null = null;

export const getCVData = async (): Promise<CVData> => {
  if (cvDataCache) {
    console.log('Using cached CV data:', cvDataCache.cv.email);
    return cvDataCache;
  }

  try {
    console.log('Fetching CV data from /Ahmad_Jalil_CV.yaml');
    // Try to fetch from the public directory first (which should contain the pre-fetched YAML)
    let response = await fetch('/Ahmad_Jalil_CV.yaml');
    
    console.log('Response status:', response.status, response.ok);
    
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
    console.log('YAML content length:', yamlContent.length);
    const rawData = parseCVData(yamlContent);
    console.log('Parsed CV data email:', rawData.cv.email);
    
    // Filter out entries with show: false
    const filteredData: CVData = {
      cv: {
        ...rawData.cv,
        sections: {
          ...rawData.cv.sections,
          experience: filterHiddenEntries(rawData.cv.sections.experience || []),
          volunteer: filterHiddenEntries(rawData.cv.sections.volunteer || []),
          projects: filterHiddenEntries(rawData.cv.sections.projects || []),
          education: filterHiddenEntries(rawData.cv.sections.education || []),
          awards: filterHiddenEntries(rawData.cv.sections.awards || []),
          presentations: filterHiddenEntries(rawData.cv.sections.presentations || []),
          publications: filterHiddenEntries(rawData.cv.sections.publications || []),
          professional_development: filterHiddenEntries(rawData.cv.sections.professional_development || []),
          certifications_and_skills: rawData.cv.sections.certifications_and_skills || (rawData.cv.sections as any).certifications_skills || [] // Handle both naming conventions
        }
      }
    };
    
    console.log('Final filtered data email:', filteredData.cv.email);
    cvDataCache = filteredData;
    return cvDataCache;
  } catch (error) {
    console.error('Error loading CV data, using fallback:', error);
    // Fallback to empty structure if loading fails
    const fallbackData = {
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
    console.log('Using fallback data with email:', fallbackData.cv.email);
    return fallbackData;
  }
};
