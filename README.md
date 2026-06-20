# TUFCLi - The Universal Forums 命令行工具

一个用于浏览和下载 ADOFAI (A Dance of Fire and Ice) 关卡的命令行工具。

## 功能特性

- 🔍 按名称、艺术家或作者搜索关卡
- 📋 查看详细的关卡信息
- ⬇️ 直接从终端下载关卡
- 🔥 浏览热门关卡
- 🎨 使用 Chalk 实现彩色输出

## 技术栈

- **TypeScript** - 类型安全的代码
- **Commander.js** - CLI 框架
- **Chalk** - 终端样式美化
- **Axios** - HTTP 客户端
- **TUF API** - The Universal Forums 官方 API (https://api.tuforums.com)

## 安装

```bash
npm install
```

## 使用方法

### 1. 搜索关卡
```bash
npm run dev -- search "关键词"
npm run dev -- search "Arche" --limit 5
npm run dev -- search "Camellia" --sort likes --order desc
```

**参数说明：**
- `query` (必填) - 搜索关键词，支持歌曲名、艺术家、谱师
- `--limit, -l` (可选) - 显示结果数量，默认 10
- `--sort, -s` (可选) - 排序字段，默认 `downloads`
  - `downloads` - 按下载量
  - `likes` - 按点赞数
  - `clears` - 按通关次数
  - `favorites` - 按收藏数
  - `bpm` - 按节奏速度
  - `tileCount` - 按关卡长度
  - `duration` - 按时长
  - `random` - 随机排序
- `--order, -o` (可选) - 排序方式：`asc`(升序), `desc`(降序)，默认 `desc`

**高级搜索技巧：**
```bash
# 搜索高 BPM 关卡
npm run dev -- search "" --sort bpm --order desc --limit 20

# 搜索最长的关卡
npm run dev -- search "" --sort tileCount --order desc --limit 10

# 搜索最受欢迎的关卡
npm run dev -- search "" --sort favorites --order desc --limit 20
```

**返回字段：**
```typescript
{
  results: [
    {
      id: number              // 关卡 ID
      song: string            // 歌曲名称
      artist: string          // 艺术家
      creator: string         // 谱师/创建者
      difficulty: {           // 难度信息
        id: number            // 难度 ID
        name: string          // 难度名称 (如 "UQ0 (U1~U4)")
        color: string         // 难度颜色
        icon: string          // 难度图标
      }
      bpm: number             // BPM（节拍速度）
      tilecount: number       // 瓦片总数
      downloadCount: number   // 下载次数
      likes: number           // 点赞数
      clears: number          // 通关次数
      videoLink: string       // 视频链接
      dlLink: string          // 下载链接
      fileId: string          // 文件 ID (备用下载)
    }
  ]
  page: number               // 当前页码
  offset: number             // 偏移量
  limit: number              // 每页数量
  hasMore: boolean           // 是否有更多结果
  total: number              // 总结果数
}
```

### 2. 查看关卡详情
```bash
npm run dev -- info 14370

# JSON 输出（适合程序调用）
npm run dev -- info 14370 --json
```

**参数说明：**
- `id` (必填) - 关卡 ID
- `--json` (可选) - 输出 JSON 格式，适合其他程序调用

**返回字段：**
```typescript
{
  level: {
    id: number                    // 关卡 ID
    song: string                  // 歌曲名称
    artist: string                // 艺术家
    creator: string               // 谱师
    difficulty: {                 // 难度信息
      id: number
      name: string                // 如 "UQ0 (U1~U4)"
      color: string
      icon: string
    }
    bpm: number                   // BPM（每分钟节拍数）
    tilecount: number             // 瓦片总数（关卡长度）
    levelLengthInMs: number       // 关卡时长（毫秒）
    videoLink: string             // YouTube 预览视频
    dlLink: string                // 直接下载链接
    fileId: string                // CDN 文件 ID
    workshopLink: string          // Steam Workshop 链接
    clears: number                // 通关次数
    likes: number                 // 点赞数
    downloadCount: number         // 下载次数
    tags: [                       // 标签数组
      {
        id: number
        name: string              // 标签名称
        icon: string
        color: string
        group: string             // 标签分组
      }
    ]
    curations: [                  // 策展信息
      {
        type: string              // 策展类型
        level: string
      }
    ]
    isHidden: boolean             // 是否隐藏
    isDeleted: boolean            // 是否删除
    createdAt: string             // 创建时间 (ISO 8601)
    updatedAt: string             // 更新时间 (ISO 8601)
  }
  rerateHistory: []               // 重评历史
}
```

**字段含义详解：**
- **song**: 歌曲名称
- **artist**: 原曲艺术家/作曲家
- **creator**: 制作这个 ADOFAI 关卡的谱师
- **difficulty.name**: 难度等级
  - P = Perfect (完美级)
  - G = Good (良好级) 
  - U = Ultra (超难级)
  - 数字表示具体难度范围
- **bpm**: 节拍速度，越高节奏越快
- **tilecount**: 需要点击的瓦片数量，代表关卡长度
- **dlLink**: 优先使用的直接下载链接
- **fileId**: 如果 dlLink 不可用，可通过 `https://api.tuforums.com/cdn/{fileId}` 下载
- **clears**: 有多少玩家通关了这个关卡
- **likes**: 点赞数，反映关卡受欢迎程度

### 3. 下载关卡
```bash
npm run dev -- download 14370
npm run dev -- download 14370 --output ~/Downloads/ADOFAI
```

**参数说明：**
- `id` (必填) - 关卡 ID
- `--output, -o` (可选) - 输出目录，默认 `~/Downloads/TUFCLi`

**下载说明：**
- 文件会保存为 ZIP 格式
- 文件名格式：`{歌曲名}.zip` 或 `level-{ID}.zip`
- 下载完成后直接解压即可使用

### 4. 浏览热门关卡
```bash
npm run dev -- popular
npm run dev -- popular --limit 20
```

**参数说明：**
- `--limit, -l` (可选) - 显示结果数量，默认 10

返回格式同搜索命令，按下载量降序排列。

## API 参数完整说明

### 搜索 API (`GET /v2/database/levels`)

**查询参数：**
```typescript
{
  query?: string           // 搜索文本
  pguRange?: string        // PGU 难度范围过滤（如："50-100"）
  sort?: string            // 排序字段（见下方排序选项）
  order?: 'asc' | 'desc'   // 排序方式
  page?: number            // 页码（从 0 开始）
  offset?: number          // 偏移量
  limit?: number           // 每页数量
  facetQuery?: string      // JSON 格式的多维过滤
  byCreatorId?: string     // 按创建者 ID 过滤
}
```

**排序字段 (sort) 选项：**
- `id` - 按关卡 ID 排序
- `downloads` / `downloadCount` - 按下载次数
- `favorites` - 按收藏数
- `likes` - 按点赞数
- `clears` / `totalClears` - 按通关数
- `passRecords` - 按完美通关记录数
- `bpm` - 按 BPM（节奏速度）
- `duration` / `levelLengthInMs` - 按关卡时长
- `tileCount` - 按瓦片数量
- `baseScore` - 按基础分数
- `random` - 随机排序

**难度范围 (pguRange) 格式：**
- 格式：`"min-max"` 例如：`"50-100"`, `"150-200"`
- PGU = Perfect Game Units（完美游戏单位）
- 常用范围：
  - 简单：0-50
  - 中等：50-100
  - 困难：100-150
  - 超难：150-200
  - 极难：200+

**标签过滤 (facetQuery) 示例：**
```json
{
  "tags": ["Tech", "Full VFX", "Rolling"],
  "curationTypes": ["Featured", "Spotlight"]
}
```

**常用标签列表：**
- `Tech` - 技术向关卡
- `Pseudo` - 伪押（假性节奏）
- `Rolling` - 滚键技巧
- `Full VFX` - 完整视觉特效
- `Low VFX` - 低视觉特效（性能友好）
- `Free Roam` - 自由漫游模式
- `Multi Track` - 多轨道
- `Hold` - 长按机制
- `Key Count` - 按键计数显示
- `Swing` - 摇摆节奏
- `DLC` - DLC 相关内容

**策展类型 (Curation Types)：**
- `Featured` - 精选关卡
- `Spotlight` - 聚光灯推荐
- `Legendary` - 传奇关卡
- `Weekly Pick` - 每周精选
- `Community Favorite` - 社区最爱

### 获取详情 API (`GET /v2/database/levels/{id}`)

**路径参数：**
- `id` - 关卡 ID (数字)

**响应：**
- 成功：200 + 完整关卡对象
- 未找到：404
- 无权限：403

### 下载链接获取

关卡下载有两种方式：
1. **dlLink** - 直接下载链接（优先使用）
2. **fileId** - CDN 文件 ID，通过 `https://api.tuforums.com/cdn/{fileId}` 访问

## 程序化调用

如果你想在其他程序中使用这个工具，可以直接调用 API 服务模块：

```typescript
import { searchLevels, getLevelById, downloadLevel, getDownloadLink } from './services/api'

// 搜索关卡
const results = await searchLevels({
  query: 'Arche',
  limit: 10,
  sort: 'downloads',
  order: 'desc'
})

// 获取关卡详情
const level = await getLevelById(14370)

// 获取下载链接
const downloadUrl = getDownloadLink(level)

// 下载关卡到指定目录
const filePath = await downloadLevel(14370, './downloads')
```

## 项目结构

```
src/
  ├── cli.ts              # CLI 主程序
  └── services/
      └── api.ts          # API 服务（真实 TUF API）
```

## 构建

```bash
npm run build
```

生成的文件在 `dist/` 目录。

## 示例：查找 Arche 关卡

```bash
# 1. 搜索 Arche
$ npm run dev -- search "Arche" --limit 5

🔍 Searching for: Arche...

Found 13 results (showing 5):

1. Arche
   Artist: Camellia (かめりあ)
   Mapper: Slime0205 & Geon Pi
   Difficulty: UQ0 (U1~U4)
   Downloads: 3 | Likes: 1
   ID: 14370

# 2. 查看详情
$ npm run dev -- info 14370

============================================================
🎵 Arche
============================================================

Artist:      Camellia (かめりあ)
Mapper:      Slime0205 & Geon Pi
Difficulty:  UQ0 (U1~U4)
BPM:         200
Tiles:       4139
Downloads:   3
Likes:       1
Clears:      0

Tags:
#DLC #Low VFX

Video:
https://www.youtube.com/watch?v=wlxql5KlzPI

Download URL:
https://api.tuforums.com/cdn/1a594bbe-b41e-4589-afcc-a6fb7adf596b

# 3. 下载关卡
$ npm run dev -- download 14370

⬇ Downloading level 14370...

✓ Download complete!
Saved to: C:\Users\YourName\Downloads\TUFCLi\Arche.zip
```

## 常见问题

**Q: 为什么搜索或获取详情时超时？**
A: TUF API 服务器可能响应较慢，工具已设置 120 秒超时。如果持续失败，请检查网络连接。

**Q: 下载的文件如何使用？**
A: 下载的 ZIP 文件解压后，将文件夹放入 ADOFAI 的自定义关卡目录即可。

**Q: 支持批量下载吗？**
A: 当前版本不支持，但你可以编写脚本循环调用 download 命令。

## 批量操作示例

### PowerShell 批量下载
```powershell
# 搜索并批量下载前 10 个结果
$query = "Camellia"
npm run dev -- search $query --limit 10 > search-results.txt

# 从输出中提取 ID 并下载
Get-Content search-results.txt | Select-String "ID: (\d+)" | ForEach-Object {
    $id = $_.Matches[0].Groups[1].Value
    npm run dev -- download $id
}
```

### Bash 批量获取下载链接
```bash
# 搜索并获取所有下载链接
npm run dev -- search "Tech" --limit 5 | grep "ID:" | awk '{print $NF}' | while read id; do
    npm run dev -- info $id | grep "Download URL:"
done
```

### 使用 Node.js 脚本批量操作
```javascript
import { searchLevels, getLevelById, downloadLevel } from './services/api.js'

// 批量下载搜索结果
async function batchDownload(query, limit = 10) {
  const results = await searchLevels({ query, limit })
  
  for (const level of results.results) {
    console.log(`Downloading: ${level.song}`)
    try {
      const path = await downloadLevel(level.id)
      console.log(`✓ Saved to: ${path}`)
    } catch (error) {
      console.error(`✗ Failed: ${error.message}`)
    }
  }
}

// 执行
batchDownload('Arche')
```

## 高级搜索示例

### 按难度和标签搜索
```bash
# 搜索高难度 Tech 关卡
npm run dev -- search "Tech" --limit 20 --sort difficulty
```

### 按创建者搜索
```bash
# 搜索特定谱师的作品
npm run dev -- search "" --limit 50 | grep "Mapper: TechnoMapper"
```

### 组合排序
```bash
# 按点赞数降序查找最受欢迎的关卡
npm run dev -- search "" --limit 20 --sort likes --order desc
```

## API 文档

完整 API 文档见：`Doc/openapi.json`

## 许可证

MIT
