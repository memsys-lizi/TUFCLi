# TUFCLi

A Dance of Fire and Ice 关卡下载器 - 支持 TUI 界面和命令行接口

## 安装和运行

```bash
npm install
npm run build
npm start  # 启动 TUI 界面
```

## 命令行接口

### 1. 搜索关卡
```bash
node dist/cli.js search <query> [options]
```

**参数**:
- `<query>` - 搜索关键词（必需）
- `--tags, -t <tags>` - 标签过滤（逗号分隔）
- `--difficulty, -d <range>` - 难度范围（如：50-100）
- `--sort, -s <field>` - 排序字段（id/favorites/totalClears/bpm/duration）
- `--order, -o <order>` - 排序方向（asc/desc）
- `--limit, -l <number>` - 结果数量（默认：20）
- `--output <format>` - 输出格式（json/text，默认：json）

**示例**:
```bash
# 搜索 Arche
node dist/cli.js search Arche --output text

# 高级搜索
node dist/cli.js search "Camellia" --difficulty 150-200 --tags "Tech" --sort favorites --output json
```

### 2. 获取关卡详情
```bash
node dist/cli.js detail <id> [options]
```

**参数**:
- `<id>` - 关卡 ID（必需）
- `--output <format>` - 输出格式（json/text，默认：json）

**示例**:
```bash
node dist/cli.js detail 14370 --output json
```

### 3. 获取下载链接
```bash
node dist/cli.js link <id> [options]
```

**参数**:
- `<id>` - 关卡 ID（必需）
- `--output <format>` - 输出格式（json/text，默认：json）

**示例**:
```bash
# 纯文本输出（只返回链接）
node dist/cli.js link 14370 --output text

# JSON 输出（包含详细信息）
node dist/cli.js link 14370 --output json
```

**JSON 输出示例**:
```json
{
  "success": true,
  "data": {
    "levelId": 14370,
    "song": "Arche",
    "artist": "Camellia (かめりあ)",
    "downloadLink": "https://api.tuforums.com/cdn/75de23fa-c1fc-4bcc-b232-0e4162292bf8",
    "fileId": "75de23fa-c1fc-4bcc-b232-0e4162292bf8"
  }
}
```

### 4. 下载关卡
```bash
node dist/cli.js download <id> [options]
```

**参数**:
- `<id>` - 关卡 ID（必需）
- `--output, -o <path>` - 输出目录（默认：~/Downloads/TUFCLi）

**示例**:
```bash
node dist/cli.js download 14370
node dist/cli.js download 14370 --output ./levels
```

## API 端点

- 搜索: `GET /v2/database/levels`
- 详情: `GET /v2/database/levels/{id}`
- CDN 数据: `GET /v2/database/levels/{id}/cdnData`
- 下载: `GET /cdn/{fileId}` (重定向到实际 CDN)

## 输出格式

所有命令支持两种输出格式：

### JSON 格式（默认）
用于程序化处理，包含完整数据结构：
```json
{
  "success": true,
  "data": { ... }
}
```

### TEXT 格式
用于人类阅读，简洁易读：
```
Found 13 levels:
  [14370] Arche - Camellia (かめりあ) (UQ0)
  ...
```

## 批量操作示例

### PowerShell
```powershell
# 搜索并获取所有下载链接
$result = node dist/cli.js search "Tech" --limit 10 --output json | ConvertFrom-Json
$result.data.results | ForEach-Object {
  node dist/cli.js link $_.id --output text
}
```

### Bash
```bash
# 搜索并下载
node dist/cli.js search "Arche" --output json | \
  jq -r '.data.results[].id' | \
  while read id; do
    node dist/cli.js download $id
  done
```

## 排序选项

- `id` - 按 ID
- `favorites` - 按收藏数
- `totalClears` - 按通关数
- `passRecords` - 按烟关记录
- `bpm` - 按节奏
- `duration` - 按时长
- `tileCount` - 按物块数
- `baseScore` - 按基础分
- `random` - 随机

## 常用标签

- `Tech` - 技术向
- `Pseudo` - 伪押
- `Rolling` - 滚键
- `Full VFX` - 完整视效
- `Free Roam` - 自由漫游
- `Multi Track` - 多轨道
- `Hold` - 长按
- `Key Count` - 按键计数
