import { Level } from '../api/types.js';

export const formatDuration = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const formatDifficulty = (difficulty: Level['difficulty']): string => {
  return difficulty.name;
};

export const formatTags = (tags: Level['tags']): string => {
  return tags.map(t => t.name).join(', ');
};

export const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
};
