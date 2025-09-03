import { useState, useEffect } from 'react';
import { getCVData, CVData } from '../utils/cvData';
import { generateTerminalConfig, generateFileNames, TerminalConfig } from '../utils/terminalConfig';

interface UseTerminalConfigReturn {
  config: TerminalConfig;
  fileNames: {
    pdfFileName: string;
    yamlFileName: string;
  };
  cvData: CVData | null;
  isLoading: boolean;
  error: string | null;
}

export const useTerminalConfig = (): UseTerminalConfigReturn => {
  const [config, setConfig] = useState<TerminalConfig>(generateTerminalConfig(null));
  const [fileNames, setFileNames] = useState(generateFileNames(null));
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get CV data
        const data = await getCVData();
        console.log('useTerminalConfig loaded CV data:', data.cv); // Debug log
        
        // Generate configuration based on CV data
        const terminalConfig = generateTerminalConfig(data);
        const fileNameConfig = generateFileNames(data);
        
        setCvData(data);
        setConfig(terminalConfig);
        setFileNames(fileNameConfig);
      } catch (err) {
        console.error('Error loading terminal config:', err);
        setError(err instanceof Error ? err.message : 'Failed to load configuration');
        
        // Use fallback configuration
        setConfig(generateTerminalConfig(null));
        setFileNames(generateFileNames(null));
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  return {
    config,
    fileNames,
    cvData,
    isLoading,
    error
  };
};
