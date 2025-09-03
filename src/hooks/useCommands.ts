import { useState, useEffect } from 'react';
import { getCVData, CVData } from '../utils/cvData';
import { generateAvailableCommands, convertToTerminalCommands, CommandMapping } from '../utils/commandMapping';

interface UseCommandsReturn {
  commands: Array<{ cmd: string; desc: string }>;
  commandMappings: CommandMapping[];
  isLoading: boolean;
  error: string | null;
}

export const useCommands = (): UseCommandsReturn => {
  // Initialize with static commands immediately available
  const [commands, setCommands] = useState<Array<{ cmd: string; desc: string }>>(() => {
    const staticCommands = generateAvailableCommands(null); // This returns static commands
    return convertToTerminalCommands(staticCommands);
  });
  const [commandMappings, setCommandMappings] = useState<CommandMapping[]>(() => {
    return generateAvailableCommands(null); // This returns static commands
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCommands = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get CV data
        const cvData: CVData = await getCVData();
        
        // Generate available commands based on CV data
        const availableCommands = generateAvailableCommands(cvData);
        
        // Convert to format expected by Terminal component
        const terminalCommands = convertToTerminalCommands(availableCommands);
        
        setCommandMappings(availableCommands);
        setCommands(terminalCommands);
      } catch (err) {
        console.error('Error loading commands:', err);
        setError(err instanceof Error ? err.message : 'Failed to load commands');
        
        // Fallback to basic commands if loading fails
        const fallbackCommands = generateAvailableCommands(null);
        const terminalCommands = convertToTerminalCommands(fallbackCommands);
        setCommandMappings(fallbackCommands);
        setCommands(terminalCommands);
      } finally {
        setIsLoading(false);
      }
    };

    loadCommands();
  }, []);

  return {
    commands,
    commandMappings,
    isLoading,
    error
  };
};
