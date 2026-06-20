import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import SearchBox from './components/SearchBox.js';
import LevelList from './components/LevelList.js';
import LevelDetail from './components/LevelDetail.js';
import { Level } from './api/types.js';

type Screen = 'search' | 'detail';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('search');
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);

  useInput((input, key) => {
    if (input === 'q' && screen === 'search') {
      process.exit(0);
    }
    if (key.escape && screen === 'detail') {
      setScreen('search');
      setSelectedLevel(null);
    }
  });

  const handleSelectLevel = (level: Level) => {
    setSelectedLevel(level);
    setScreen('detail');
  };

  const handleBack = () => {
    setScreen('search');
    setSelectedLevel(null);
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Box borderStyle="round" borderColor="cyan" paddingX={2} paddingY={1}>
        <Text bold color="cyan">
          TUF CLI - The Universal Forums Level Downloader
        </Text>
      </Box>

      {screen === 'search' && (
        <Box flexDirection="column" marginTop={1}>
          <SearchBox />
          <LevelList onSelect={handleSelectLevel} />
        </Box>
      )}

      {screen === 'detail' && selectedLevel && (
        <LevelDetail level={selectedLevel} onBack={handleBack} />
      )}

      <Box borderStyle="round" borderColor="gray" marginTop={1} paddingX={2}>
        <Text dimColor>
          {screen === 'search' ? '↑↓ Navigate | Enter Select | Q Quit' : 'Esc Back | Q Quit'}
        </Text>
      </Box>
    </Box>
  );
};

export default App;
