import React, { createContext, useContext, ReactNode } from 'react';
import { useCommands } from '../hooks/useCommands';
import { CommandMapping } from '../utils/commandMapping';

interface CommandsContextType {
  commands: Array<{ cmd: string; desc: string }>;
  commandMappings: CommandMapping[];
  isLoading: boolean;
  error: string | null;
}

const CommandsContext = createContext<CommandsContextType | undefined>(undefined);

interface CommandsProviderProps {
  children: ReactNode;
}

export const CommandsProvider: React.FC<CommandsProviderProps> = ({ children }) => {
  const commandsData = useCommands();

  return (
    <CommandsContext.Provider value={commandsData}>
      {children}
    </CommandsContext.Provider>
  );
};

export const useCommandsContext = (): CommandsContextType => {
  const context = useContext(CommandsContext);
  if (context === undefined) {
    throw new Error('useCommandsContext must be used within a CommandsProvider');
  }
  return context;
};
