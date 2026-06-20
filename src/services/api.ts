import axios from "axios"
import fs from "fs"
import path from "path"
import os from "os"

const client = axios.create({
  baseURL: "https://api.tuforums.com",
  timeout: 120000, // 120 秒超时
  headers: {
    "Content-Type": "application/json",
  },
})

// 请求延迟（避免触发频率限制）
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 请求重试配置
const RETRY_CONFIG = {
  maxRetries: 3,          // 最大重试次数
  retryDelay: 2000,       // 重试间隔（毫秒）
  retryDelayMultiplier: 2 // 重试延迟倍增系数
}

// 带重试的请求包装器
async function requestWithRetry<T>(
  requestFn: () => Promise<T>,
  retries = RETRY_CONFIG.maxRetries,
  retryDelay = RETRY_CONFIG.retryDelay
): Promise<T> {
  try {
    return await requestFn()
  } catch (error) {
    if (retries > 0) {
      // 等待后重试
      await delay(retryDelay)
      return requestWithRetry(
        requestFn,
        retries - 1,
        retryDelay * RETRY_CONFIG.retryDelayMultiplier
      )
    }
    throw error
  }
}

// Response interceptor for error handling
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message = error.response.data?.message || error.response.statusText || error.message
      throw new Error(`API Error: ${message}`)
    } else if (error.request) {
      throw new Error("Network Error: No response from server")
    } else {
      throw new Error(`Request Error: ${error.message}`)
    }
  }
)

export interface Level {
  id: number
  song: string
  artist: string
  creator: string
  difficulty: {
    id: number
    name: string
    color: string
    icon: string
  }
  bpm: number
  tilecount: number
  levelLengthInMs: number
  videoLink: string
  dlLink: string
  fileId: string
  workshopLink: string
  clears: number
  likes: number
  downloadCount: number
  tags: Array<{
    id: number
    name: string
    icon: string
    color: string
    group: string
  }>
  curations: Array<{
    type: string
    level: string
  }>
  isHidden: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface SearchResponse {
  results: Level[]
  page: number
  offset: number
  limit: number
  hasMore: boolean
  total: number
}

export interface SearchParams {
  query?: string
  pguRange?: string
  sort?: string
  order?: "asc" | "desc"
  page?: number
  offset?: number
  limit?: number
  facetQuery?: string
  byCreatorId?: string
}

export async function searchLevels(params: SearchParams): Promise<SearchResponse> {
  return requestWithRetry(async () => {
    await delay(500) // 请求前延迟 500ms，避免频率限制
    const response = await client.get<SearchResponse>("/v2/database/levels", { params })
    return response.data
  })
}

export async function getLevelById(id: number): Promise<Level> {
  return requestWithRetry(async () => {
    await delay(500) // 请求前延迟 500ms
    const response = await client.get<{ level: Level }>(`/v2/database/levels/${id}`)
    return response.data.level
  })
}

export function getDownloadLink(level: Level): string {
  if (level.dlLink) {
    return level.dlLink
  } else if (level.fileId) {
    return `https://api.tuforums.com/cdn/${level.fileId}`
  }
  throw new Error("No download link available")
}

export async function downloadLevel(levelId: number, outputDir?: string): Promise<string> {
  return requestWithRetry(async () => {
    await delay(500) // 请求前延迟 500ms
    const level = await getLevelById(levelId)
    const downloadUrl = getDownloadLink(level)
    
    const defaultDir = path.join(os.homedir(), "Downloads", "TUFCLi")
    const targetDir = outputDir || defaultDir
    
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
    }
    
    const filename = level.song ? `${level.song.replace(/[<>:"/\\|?*]/g, "_")}.zip` : `level-${levelId}.zip`
    
    const downloadResponse = await client.get(downloadUrl, {
      responseType: "arraybuffer",
      maxRedirects: 5,
    })
    
    const filePath = path.join(targetDir, filename)
    fs.writeFileSync(filePath, downloadResponse.data)
    
    return filePath
  })
}
