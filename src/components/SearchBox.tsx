import React, { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';

const SearchBox: React.FC = () => {
  const [query, setQuery] = useState('');

  return (
    <Box borderStyle="round" borderColor="blue" padding={1} flexDirection="column">
      <Box>
        <Text bold color="blue">Search: </Text>
        <TextInput
          value={query}
          onChange={setQuery}
          placeholder="Enter level name, artist, or creator..."
        />
      </Box>
    </Box>
  );
};

export default SearchBox;
