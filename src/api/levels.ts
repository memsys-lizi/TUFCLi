import client from './client.js';
import { SearchParams, SearchResponse, Level } from './types.js';

export const searchLevels = async (params: SearchParams): Promise<SearchResponse> => {
  const response = await client.get<SearchResponse>('/v2/database/levels', { params });
  return response.data;
};

export const getLevelById = async (id: number): Promise<Level> => {
  const response = await client.get<Level>(`/v2/database/levels/${id}`);
  return response.data;
};

export const getLevelCdnData = async (id: number): Promise<any> => {
  const response = await client.get(`/v2/database/levels/${id}/cdnData`);
  return response.data;
};

export const getDownloadLink = (fileId: string): string => {
  return `https://api.tuforums.com/cdn/${fileId}`;
};
