// API Types
export interface Level {
  id: number;
  song: string;
  artist: string;
  creator: string;
  difficulty: {
    id: number;
    name: string;
    color: string;
    icon: string;
  };
  bpm: number;
  tilecount: number;
  levelLengthInMs: number;
  videoLink: string;
  dlLink: string;
  fileId: string;
  workshopLink: string;
  clears: number;
  likes: number;
  downloadCount: number;
  tags: Tag[];
  curations: Curation[];
  isHidden: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LevelDetailResponse {
  level: Level;
  rerateHistory: any[];
}

export interface Tag {
  id: number;
  name: string;
  icon: string;
  color: string;
  group: string;
}

export interface Curation {
  type: string;
  level: string;
}

export interface SearchResponse {
  results: Level[];
  page: number;
  offset: number;
  limit: number;
  hasMore: boolean;
  total: number;
}

export interface SearchParams {
  query?: string;
  pguRange?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  offset?: number;
  limit?: number;
  facetQuery?: string;
  byCreatorId?: string;
}
