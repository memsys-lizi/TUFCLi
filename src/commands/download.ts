import { Command } from 'commander';
import { getLevelById, getDownloadLink } from '../api/levels.js';
import { downloadFile, ensureDirectoryExists } from '../utils/download.js';
import path from 'path';

export const downloadCommand = new Command('download')
  .description('Download a level')
  .argument('<id>', 'Level ID')
  .option('--get-link', 'Only return the download link')
  .option('-p, --path <path>', 'Download destination path')
  .option('--output <format>', 'Output format (json/text)', 'json')
  .action(async (id, options) => {
    try {
      const level = await getLevelById(parseInt(id));
      const downloadUrl = getDownloadLink(level.fileId);

      if (options.getLink) {
        console.log(JSON.stringify({ success: true, data: { url: downloadUrl } }, null, 2));
        return;
      }

      if (!options.path) {
        console.error(JSON.stringify({ success: false, error: 'Download path is required. Use --path or --get-link' }));
        process.exit(1);
      }

      const filename = `${level.id}_${level.song.replace(/[^a-z0-9]/gi, '_')}.zip`;
      const destPath = path.join(options.path, filename);

      ensureDirectoryExists(destPath);

      await downloadFile(downloadUrl, destPath, (progress) => {
        if (options.output !== 'json') {
          process.stdout.write(`\rDownloading: ${progress.toFixed(1)}%`);
        }
      });

      if (options.output === 'json') {
        console.log(JSON.stringify({ success: true, data: { path: destPath } }, null, 2));
      } else {
        console.log(`\nDownloaded to: ${destPath}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error(JSON.stringify({ success: false, error: message }));
      process.exit(1);
    }
  });
