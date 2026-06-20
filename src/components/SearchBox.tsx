import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { getTheme, borderStyle, spacing } from '../theme.js';

interface Props {
  value: string;
  onSearch: (query: string) => void;
  disabled?: boolean;
}

const SearchBox: React.FC<Props> = ({ value: initialValue, onSearch, disabled = false }) => {
  const theme = getTheme();
  const [query, setQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(true);

  // Handle Enter key to trigger search
  useInput((input, key) => {
    if (key.return && isFocused && !disabled) {
      onSearch(query);
    }
  });

  return (
    <Box 
      borderStyle={borderStyle} 
      borderColor={isFocused ? theme.borderActive : theme.border} 
      padding={spacing.sm} 
      flexDirection="column"
    >
      <Box>
        <Text bold color={theme.info}>Search: </Text>
        <TextInput
          value={query}
          onChange={setQuery}
          placeholder="Enter level name, artist, or creator..."
          onSubmit={() => {
            if (!disabled) {
              onSearch(query);
            }
          }}
          showCursor={!disabled}
        />
      </Box>
      <Box marginTop={spacing.xs}>
        <Text dimColor color={theme.textMuted}>
          Press Enter to search
        </Text>
      </Box>
    </Box>
  );
};

export default SearchBox;
