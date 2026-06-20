import { Command } from 'commander';
import { getLevelById } from '../api/levels.js';

export const detailCommand = new Command('detail')
  .description('Get level details')
  .argument('<id>', 'Level ID')
  .option('--output <format>', 'Output format (json/text)', 'json')
  .action(async (id, options) => {
    try {
      const response = await getLevelById(parseInt(id));
      const level = response.level;

      if (options.output === 'json') {
        console.log(JSON.stringify({ success: true, data: level }, null, 2));
      } else {
        console.log(`Level #${level.id}`);
        console.log(`Song: ${level.song}`);
        console.log(`Artist: ${level.artist}`);
        console.log(`Creator: ${level.creator}`);
        console.log(`Difficulty: ${level.difficulty.name}`);
        console.log(`BPM: ${level.bpm}`);
        console.log(`Tiles: ${level.tilecount}`);
        console.log(`Downloads: ${level.downloadCount}`);
        console.log(`Likes: ${level.likes}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error(JSON.stringify({ success: false, error: message }));
      process.exit(1);
    }
  });
