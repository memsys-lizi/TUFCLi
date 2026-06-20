import { Command } from 'commander';
import { getLevelById } from '../api/levels.js';

export const linkCommand = new Command('link')
  .description('Get download link for a level')
  .argument('<id>', 'Level ID')
  .option('--output <format>', 'Output format (json/text)', 'json')
  .action(async (id, options) => {
    try {
      const levelId = parseInt(id);
      const level = await getLevelById(levelId);

      if (!level.dlLink && !level.fileId) {
        throw new Error('No download link available for this level');
      }

      const downloadLink = level.dlLink || `https://api.tuforums.com/cdn/${level.fileId}`;

      if (options.output === 'json') {
        console.log(JSON.stringify({
          success: true,
          data: {
            levelId: level.id,
            song: level.song,
            artist: level.artist,
            downloadLink: downloadLink,
            fileId: level.fileId
          }
        }, null, 2));
      } else {
        console.log(downloadLink);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error(JSON.stringify({ success: false, error: message }));
      process.exit(1);
    }
  });
