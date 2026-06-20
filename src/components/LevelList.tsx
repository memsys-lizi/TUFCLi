import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import TextInput from 'ink-text-input';
import { Level } from '../api/types.js';
import { truncate } from '../utils/format.js';
import { fuzzySearchLevels } from '../utils/fuzzy.js';
import { getTheme, borderStyle, spacing } from '../theme.js';

interface Props {
  levels: Level[];
  onSelect: (level: Level) => void;
  focused?: boolean;
}

const LevelList: React.FC<Props> = ({ levels, onSelect, focused = true }) => {
  const theme = getTheme();
  const [filterQuery, setFilterQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  useInput((input) => {
    if (!focused) return;
    
    // Toggle filter with '/' key
    if (input === '/' && !showFilter) {
      setShowFilter(true);
    }
  });

  // Apply fuzzy search filter
  const filteredLevels = showFilter && filterQuery
    ? fuzzySearchLevels(levels, filterQuery)
    : levels;

  if (levels.length === 0) {
    return (
      <Box 
        marginTop={spacing.sm} 
        borderStyle={borderStyle} 
        borderColor={theme.border} 
        padding={spacing.sm}
      >
        <Text color={theme.textMuted}>No levels found. Try a different search query.</Text>
      </Box>
    );
  }

  const items = filteredLevels.map((level) => ({
    label: `#${level.id} ${truncate(level.song, 30)} - ${truncate(level.artist, 20)} [${level.difficulty.name}]`,
    value: level,
  }));

  return (
    <Box 
      marginTop={spacing.sm} 
      borderStyle={borderStyle} 
      borderColor={focused ? theme.success : theme.border} 
      padding={spacing.sm} 
      flexDirection="column"
    >
      <Text bold color={theme.success}>
        Results ({filteredLevels.length}/{levels.length}):
      </Text>

      {/* Client-side fuzzy filter */}
      {showFilter && (
        <Box marginTop={spacing.xs} flexDirection="column">
          <Box>
            <Text color={theme.info}>Filter: </Text>
            <TextInput
              value={filterQuery}
              onChange={setFilterQuery}
              placeholder="Type to filter results..."
              onSubmit={() => setShowFilter(false)}
            />
          </Box>
          <Text dimColor color={theme.textMuted}>
            Press Enter to close filter, Esc to clear
          </Text>
        </Box>
      )}

      {!showFilter && filterQuery && (
        <Box marginTop={spacing.xs}>
          <Text color={theme.info}>
            Filtered: "{filterQuery}" <Text dimColor>(Press / to edit)</Text>
          </Text>
        </Box>
      )}

      {!showFilter && !filterQuery && (
        <Box marginTop={spacing.xs}>
          <Text dimColor>Press / to filter results locally</Text>
        </Box>
      )}

      <Box marginTop={spacing.xs}>
        <SelectInput 
          items={items} 
          onSelect={(item) => onSelect(item.value as Level)}
          isFocused={focused && !showFilter}
        />
      </Box>
    </Box>
  );
};

export default LevelList;
