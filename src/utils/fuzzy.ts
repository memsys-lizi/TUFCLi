import fuzzysort from 'fuzzysort';
import { Level } from '../api/types.js';

/**
 * Fuzzy search for levels
 * Searches across song name, artist, and creator
 */
export const fuzzySearchLevels = (levels: Level[], query: string): Level[] => {
  if (!query || query.trim() === '') {
    return levels;
  }

  const needle = query.trim();

  // Prepare searchable strings for each level
  const preparedLevels = levels.map(level => ({
    level,
    searchString: `${level.song} ${level.artist} ${level.creator}`.toLowerCase(),
  }));

  // Perform fuzzy search
  const results = fuzzysort.go(needle, preparedLevels, {
    key: 'searchString',
    threshold: -10000, // Lower threshold = more lenient matching
    limit: 100, // Max results to return
  });

  return results.map(result => result.obj.level);
};

/**
 * Fuzzy search for tags
 * Used in FilterPanel for tag selection
 */
export const fuzzySearchTags = (tags: string[], query: string): string[] => {
  if (!query || query.trim() === '') {
    return tags;
  }

  const results = fuzzysort.go(query, tags, {
    threshold: -10000,
  });

  return results.map(result => result.target);
};

/**
 * Highlight matched characters in fuzzy search results
 * Returns a string with ANSI color codes for highlighting
 */
export const highlightMatch = (str: string, query: string): string => {
  if (!query) return str;

  const result = fuzzysort.single(query, str);
  if (!result) return str;

  // For now, return the original string
  // In a real implementation, we could use Ink's Text components with different colors
  return str;
};
