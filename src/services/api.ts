import axios from "axios"

const BASE_URL = "https://api.rhythm.cafe"

export interface Level {
  id: number
  title: string
  artist: string
  author: string
  difficulty: number
  description: string
  tags: string[]
  downloads: number
  rating: number
  url: string
  thumbnailUrl?: string
  createdAt: string
}

export interface SearchResult {
  levels: Level[]
  total: number
  page: number
  pageSize: number
}

// 模拟数据用于演示
const MOCK_LEVELS: Level[] = [
  {
    id: 1,
    title: "Freedom Dive",
    artist: "xi",
    author: "TechnoMapper",
    difficulty: 18,
    description: "A legendary fast-paced level with complex patterns",
    tags: ["hard", "speed", "technical"],
    downloads: 15420,
    rating: 4.8,
    url: "https://example.com/levels/1",
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    title: "Lonely Dance",
    artist: "Set It Off",
    author: "DanceKing",
    difficulty: 12,
    description: "Medium difficulty level with flowing movements",
    tags: ["medium", "flow", "fun"],
    downloads: 8230,
    rating: 4.5,
    url: "https://example.com/levels/2",
    createdAt: "2024-02-10"
  },
  {
    id: 3,
    title: "Cyber Thunder",
    artist: "Kobaryo",
    difficulty: 20,
    author: "SpeedDemon",
    description: "Extreme difficulty, only for experts!",
    tags: ["extreme", "speed", "hardcore"],
    downloads: 5120,
    rating: 4.9,
    url: "https://example.com/levels/3",
    createdAt: "2024-03-05"
  },
  {
    id: 4,
    title: "Moonlight Sonata",
    artist: "Beethoven",
    author: "ClassicalFan",
    difficulty: 8,
    description: "Beautiful classical piece adapted for ADOFAI",
    tags: ["easy", "classical", "relaxing"],
    downloads: 12500,
    rating: 4.6,
    url: "https://example.com/levels/4",
    createdAt: "2024-01-20"
  },
  {
    id: 5,
    title: "Electro Swing Dance",
    artist: "Caravan Palace",
    author: "SwingMaster",
    difficulty: 14,
    description: "Groovy electro swing rhythms",
    tags: ["medium", "swing", "groovy"],
    downloads: 9800,
    rating: 4.7,
    url: "https://example.com/levels/5",
    createdAt: "2024-02-28"
  }
]

export async function searchLevels(
  query: string,
  page: number = 1,
  pageSize: number = 20
): Promise<SearchResult> {
  try {
    // 尝试真实 API
    const response = await axios.get(`${BASE_URL}/levels`, {
      params: {
        q: query,
        page,
        limit: pageSize,
      },
      timeout: 3000
    })
    
    return {
      levels: response.data.data || [],
      total: response.data.total || 0,
      page: response.data.page || 1,
      pageSize: response.data.limit || pageSize,
    }
  } catch (error) {
    // 使用模拟数据
    const lowerQuery = query.toLowerCase()
    const filtered = MOCK_LEVELS.filter(level => 
      level.title.toLowerCase().includes(lowerQuery) ||
      level.artist.toLowerCase().includes(lowerQuery) ||
      level.author.toLowerCase().includes(lowerQuery) ||
      level.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
    
    return {
      levels: filtered,
      total: filtered.length,
      page: 1,
      pageSize: filtered.length,
    }
  }
}

export async function getLevelById(id: number): Promise<Level | null> {
  try {
    const response = await axios.get(`${BASE_URL}/levels/${id}`, { timeout: 3000 })
    return response.data
  } catch (error) {
    // 使用模拟数据
    return MOCK_LEVELS.find(level => level.id === id) || null
  }
}

export async function downloadLevel(url: string, outputPath: string): Promise<boolean> {
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 30000
    })
    
    // 这里需要文件系统操作，稍后实现
    return true
  } catch (error) {
    console.error("Failed to download level:", error)
    return false
  }
}
