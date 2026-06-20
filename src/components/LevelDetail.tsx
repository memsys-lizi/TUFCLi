import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import Spinner from 'ink-spinner';
import { Level } from '../api/types.js';
import { formatDuration, formatTags } from '../utils/format.js';
import { getTheme, borderStyle, spacing } from '../theme.js';

interface Props {
  level: Level;
  onBack: () => void;
  onDownload: (levelId: number) => Promise<string>;
}

const LevelDetail: React.FC<Props> = ({ level, onBack, onDownload }) => {
  const theme = getTheme();
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloadPath, setDownloadPath] = useState<string | null>(null);

  useInput(async (input) => {
    if (input === 'd' && !downloading && !downloadPath) {
      setDownloading(true);
      setDownloadError(null);
      try {
        const filePath = await onDownload(level.id);
        setDownloadPath(filePath);
      } catch (err) {
        setDownloadError(err instanceof Error ? err.message : 'Download failed');
      } finally {
        setDownloading(false);
      }
    }
  });

  return (
    <Box 
      marginTop={spacing.sm} 
      borderStyle={borderStyle} 
      borderColor={theme.primary} 
      padding={spacing.sm} 
      flexDirection="column"
    >
      {/* Header */}
      <Text bold color={theme.primary}>
        Level Detail - #{level.id}
      </Text>

      {/* Main Info */}
      <Box marginTop={spacing.sm} flexDirection="column">
        <Text>
          <Text bold color={theme.textBold}>Song:</Text> {level.song}
        </Text>
        <Text>
          <Text bold color={theme.textBold}>Artist:</Text> {level.artist}
        </Text>
        <Text>
          <Text bold color={theme.textBold}>Creator:</Text> {level.creator}
        </Text>

        {/* Divider */}
        <Box marginY={spacing.xs}>
          <Text color={theme.borderMuted}>{'─'.repeat(60)}</Text>
        </Box>

        {/* Stats */}
        <Text>
          <Text bold color={theme.textBold}>Difficulty:</Text> {level.difficulty.name} | 
          <Text bold color={theme.textBold}> BPM:</Text> {level.bpm} | 
          <Text bold color={theme.textBold}> Tiles:</Text> {level.tilecount}
        </Text>
        <Text>
          <Text bold color={theme.textBold}>Duration:</Text> {formatDuration(level.levelLengthInMs)}
        </Text>

        {/* Tags */}
        {level.tags.length > 0 && (
          <Text>
            <Text bold color={theme.textBold}>Tags:</Text> {formatTags(level.tags)}
          </Text>
        )}

        {/* Divider */}
        <Box marginY={spacing.xs}>
          <Text color={theme.borderMuted}>{'─'.repeat(60)}</Text>
        </Box>

        {/* Popularity */}
        <Text>
          <Text bold color={theme.textBold}>Downloads:</Text> {level.downloadCount} | 
          <Text bold color={theme.textBold}> Likes:</Text> {level.likes}
        </Text>

        {/* Download Status */}
        {downloading && (
          <Box marginTop={spacing.sm} borderStyle={borderStyle} borderColor={theme.warning} padding={spacing.sm}>
            <Text color={theme.warning}>
              <Spinner type="dots" /> Downloading level...
            </Text>
          </Box>
        )}

        {downloadError && (
          <Box marginTop={spacing.sm} borderStyle={borderStyle} borderColor={theme.error} padding={spacing.sm}>
            <Text color={theme.error}>Download Error: {downloadError}</Text>
          </Box>
        )}

        {downloadPath && (
          <Box marginTop={spacing.sm} borderStyle={borderStyle} borderColor={theme.success} padding={spacing.sm} flexDirection="column">
            <Text color={theme.success} bold>✓ Download Complete!</Text>
            <Text color={theme.textMuted}>Saved to:</Text>
            <Text color={theme.info}>{downloadPath}</Text>
          </Box>
        )}

        {/* Actions */}
        <Box marginTop={spacing.sm} flexDirection="column">
          {!downloadPath && !downloading && (
            <Text color={theme.success}>
              Press <Text bold>D</Text> to download
            </Text>
          )}
          <Text color={theme.textMuted}>
            Press <Text bold>Esc</Text> to go back
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default LevelDetail;
