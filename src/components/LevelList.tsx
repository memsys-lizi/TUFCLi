import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import SelectInput from 'ink-select-input';
import { searchLevels } from '../api/levels.js';
import { Level } from '../api/types.js';
import { formatDuration, truncate } from '../utils/format.js';

interface Props {
  onSelect: (level: Level) => void;
}

const LevelList: React.FC<Props> = ({ onSelect }) => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const result = await searchLevels({ limit: 20 });
        setLevels(result.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, []);

  if (loading) {
    return (
      <Box marginTop={1}>
        <Text color="yellow">
          <Spinner type="dots" /> Loading levels...
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box marginTop={1}>
        <Text color="red">Error: {error}</Text>
      </Box>
    );
  }

  const items = levels.map((level) => ({
    label: `#${level.id} ${truncate(level.song, 30)} - ${truncate(level.artist, 20)} [${level.difficulty.name}]`,
    value: level,
  }));

  return (
    <Box marginTop={1} borderStyle="round" borderColor="green" padding={1} flexDirection="column">
      <Text bold color="green">Results ({levels.length}):</Text>
      <SelectInput items={items} onSelect={(item) => onSelect(item.value as Level)} />
    </Box>
  );
};

export default LevelList;
