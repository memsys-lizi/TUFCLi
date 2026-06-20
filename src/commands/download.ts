import { Command } from 'commander';
import { downloadLevel } from '../api/levels.js';

export const downloadCommand = new Command('download')
  .description('Download a level')
  .argument('<id>', 'Level ID')
  .option('-o, --output <path>', 'Download destination directory')
  .action(async (id, options) => {
    try {
      const levelId = parseInt(id);
      const filePath = await downloadLevel(levelId, options.output);
      
      console.log(JSON.stringify({ 
        success: true, 
        data: { 
          levelId, 
          path: filePath 
        } 
      }, null, 2));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error(JSON.stringify({ success: false, error: message }));
      process.exit(1);
    }
  });
