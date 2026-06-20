import { Command } from 'commander';
import { searchLevels } from '../api/levels.js';
import { SearchParams } from '../api/types.js';

export const searchCommand = new Command('search')
  .description('Search for levels')
  .argument('<query>', 'Search query')
  .option('-t, --tags <tags>', 'Filter by tags (comma-separated)')
  .option('-d, --difficulty <range>', 'Difficulty range (e.g., 50-100)')
  .option('-s, --sort <field>', 'Sort by field', 'id')
  .option('-o, --order <order>', 'Sort order (asc/desc)', 'desc')
  .option('-l, --limit <number>', 'Number of results', '20')
  .option('--output <format>', 'Output format (json/text)', 'json')
  .action(async (query, options) => {
    try {
      const params: SearchParams = {
        query,
        sort: options.sort,
        order: options.order,
        limit: parseInt(options.limit),
      };

      if (options.difficulty) {
        params.pguRange = options.difficulty;
      }

      if (options.tags) {
        const tags = options.tags.split(',').map((t: string) => t.trim());
        params.facetQuery = JSON.stringify({ tags });
      }

      const result = await searchLevels(params);

      if (options.output === 'json') {
        console.log(JSON.stringify({ success: true, data: result }, null, 2));
      } else {
        console.log(`Found ${result.total} levels:`);
        result.results.forEach((level) => {
          console.log(`  [${level.id}] ${level.song} - ${level.artist} (${level.difficulty.name})`);
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error(JSON.stringify({ success: false, error: message }));
      process.exit(1);
    }
  });
