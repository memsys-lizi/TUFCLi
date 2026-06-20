import client from './client.js';
import { SearchParams, SearchResponse, Level, LevelDetailResponse } from './types.js';
import fs from 'fs';
import path from 'path';
import os from 'os';

export const searchLevels = async (params: SearchParams): Promise<SearchResponse> => {
  const response = await client.get<SearchResponse>('/v2/database/levels', { params });
  return response.data;
};

export const getLevelById = async (id: number): Promise<LevelDetailResponse> => {
  const response = await client.get<LevelDetailResponse>(`/v2/database/levels/${id}`);
  return response.data;
};

export const getLevelCdnData = async (id: number): Promise<any> => {
  const response = await client.get(`/v2/database/levels/${id}/cdnData`);
  return response.data;
};

export const getDownloadLink = (fileId: string): string => {
  return `https://api.tuforums.com/cdn/${fileId}`;
};

/**
 * Download level as ZIP file
 * @param levelId - Level ID to download
 * @param outputDir - Optional output directory (defaults to ~/Downloads/TUFCLi)
 * @returns Path to downloaded file
 */
export const downloadLevel = async (levelId: number, outputDir?: string): Promise<string> => {
  // First, get level details to get the dlLink or fileId
  const response = await getLevelById(levelId);
  const level = response.level;
  
  // Use dlLink if available (direct download link)
  let downloadUrl: string;
  let filename: string;
  
  if (level.dlLink) {
    // Use the direct download link from level data
    downloadUrl = level.dlLink;
    filename = level.song ? `${level.song.replace(/[<>:"/\\|?*]/g, '_')}.zip` : `level-${levelId}.zip`;
  } else if (level.fileId) {
    // Fallback to fileId-based download
    downloadUrl = getDownloadLink(level.fileId);
    filename = `level-${levelId}.zip`;
  } else {
    throw new Error('No download link available for this level');
  }
  
  // Determine output directory
  const defaultDir = path.join(os.homedir(), 'Downloads', 'TUFCLi');
  const targetDir = outputDir || defaultDir;
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // Download file with redirect following
  const downloadResponse = await client.get(downloadUrl, {
    responseType: 'arraybuffer',
    maxRedirects: 5, // Follow redirects
  });
  
  // Save to file
  const filePath = path.join(targetDir, filename);
  fs.writeFileSync(filePath, downloadResponse.data);
  
  return filePath;
};
