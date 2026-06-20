import React from 'react';
import { Box, Text } from 'ink';
import { Level } from '../api/types.js';
import { formatDuration, formatTags } from '../utils/format.js';

interface Props {
  level: Level;
  onBack: () => void;
}

const LevelDetail: React.FC<Props> = ({ level, onBack }) => {
  return (
    <Box marginTop={1} borderStyle="round" borderColor="cyan" padding={1} flexDirection="column">
      <Text bold color="cyan">Level Detail - #{level.id}</Text>
      <Box marginTop={1} flexDirection="column">
        <Text><Text bold>Song:</Text> {level.song}</Text>
        <Text><Text bold>Artist:</Text> {level.artist}</Text>
        <Text><Text bold>Creator:</Text> {level.creator}</Text>
        <Text>{'─'.repeat(60)}</Text>
        <Text><Text bold>Difficulty:</Text> {level.difficulty.name} | <Text bold>BPM:</Text> {level.bpm} | <Text bold>Tiles:</Text> {level.tilecount}</Text>
        <Text><Text bold>Duration:</Text> {formatDuration(level.levelLengthInMs)}</Text>
        {level.tags.length > 0 && <Text><Text bold>Tags:</Text> {formatTags(level.tags)}</Text>}
        <Text>{'─'.repeat(60)}</Text>
        <Text><Text bold>Downloads:</Text> {level.downloadCount} | <Text bold>Likes:</Text> {level.likes}</Text>
        <Box marginTop={1}>
          <Text color="green">Press Esc to go back</Text>
        </Box>
      </Box>
    </Box>
  );
};

export default LevelDetail;
