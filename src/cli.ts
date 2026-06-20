#!/usr/bin/env node
import { Command } from "commander"
import { searchLevels, getLevelById, downloadLevel, getDownloadLink } from "./services/api.js"
import chalk from "chalk"
import path from "path"
import os from "os"

const program = new Command()

program
  .name("tufcli")
  .description("TUF Level Downloader - Browse and download ADOFAI levels")
  .version("1.0.0")

// 搜索命令
program
  .command("search <query>")
  .description("Search for levels by name, artist, or author")
  .option("-l, --limit <number>", "Number of results to show", "10")
  .option("-s, --sort <field>", "Sort by field (downloads, likes, clears)", "downloads")
  .option("-o, --order <order>", "Sort order (asc, desc)", "desc")
  .option("--json", "Output results as JSON")
  .action(async (query, options) => {
    try {
      const limit = parseInt(options.limit)
      const result = await searchLevels({
        query,
        limit,
        sort: options.sort,
        order: options.order,
      })
      
      // JSON 输出模式
      if (options.json) {
        console.log(JSON.stringify(result, null, 2))
        return
      }
      
      // 人类可读模式
      console.log(chalk.cyan(`\n🔍 Searching for: ${query}...\n`))
      
      if (result.results.length === 0) {
        console.log(chalk.yellow("No results found."))
        return
      }
      
      console.log(chalk.green(`Found ${result.total} results (showing ${result.results.length}):\n`))
      
      result.results.forEach((level, index) => {
        console.log(chalk.bold(`${index + 1}. ${level.song}`))
        console.log(chalk.gray(`   Artist: ${level.artist}`))
        console.log(chalk.gray(`   Mapper: ${level.creator}`))
        console.log(chalk.yellow(`   Difficulty: ${level.difficulty.name}`))
        console.log(chalk.gray(`   Downloads: ${level.downloadCount} | Likes: ${level.likes}`))
        console.log(chalk.blue(`   ID: ${level.id}`))
        console.log()
      })
      
      console.log(chalk.cyan(`Use 'tufcli info <id>' to see more details`))
      console.log(chalk.cyan(`Use 'tufcli download <id>' to download a level\n`))
    } catch (error) {
      if (options.json) {
        console.log(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }, null, 2))
        process.exit(1)
      } else {
        console.error(chalk.red(`\n❌ Error: ${error instanceof Error ? error.message : String(error)}\n`))
      }
    }
  })

// 详情命令
program
  .command("info <id>")
  .description("Show detailed information about a level")
  .option("--json", "Output results as JSON")
  .action(async (id, options) => {
    try {
      const level = await getLevelById(parseInt(id))
      
      // JSON 输出模式
      if (options.json) {
        let downloadUrl = null
        try {
          downloadUrl = getDownloadLink(level)
        } catch (error) {
          // 下载链接不可用
        }
        console.log(JSON.stringify({ ...level, downloadUrl }, null, 2))
        return
      }
      
      // 人类可读模式
      console.log(chalk.cyan(`\n📋 Fetching level details...\n`))
      
      console.log(chalk.bold.cyan("=".repeat(60)))
      console.log(chalk.bold(`🎵 ${level.song}`))
      console.log(chalk.bold.cyan("=".repeat(60)))
      console.log()
      console.log(chalk.white(`Artist:      ${level.artist}`))
      console.log(chalk.white(`Mapper:      ${level.creator}`))
      console.log(chalk.yellow(`Difficulty:  ${level.difficulty.name}`))
      console.log(chalk.white(`BPM:         ${level.bpm}`))
      console.log(chalk.white(`Tiles:       ${level.tilecount}`))
      console.log(chalk.white(`Downloads:   ${level.downloadCount}`))
      console.log(chalk.white(`Likes:       ${level.likes}`))
      console.log(chalk.white(`Clears:      ${level.clears}`))
      console.log()
      
      if (level.tags && level.tags.length > 0) {
        console.log(chalk.bold("Tags:"))
        console.log(chalk.cyan(level.tags.map(tag => `#${tag.name}`).join(" ")))
        console.log()
      }
      
      if (level.videoLink) {
        console.log(chalk.bold("Video:"))
        console.log(chalk.blue(level.videoLink))
        console.log()
      }
      
      console.log(chalk.bold("Download URL:"))
      try {
        const downloadUrl = getDownloadLink(level)
        console.log(chalk.blue(downloadUrl))
      } catch (error) {
        console.log(chalk.red("No download link available"))
      }
      console.log()
      
      console.log(chalk.bold.cyan("=".repeat(60)))
      console.log(chalk.cyan(`\nUse 'tufcli download ${id}' to download this level`))
      console.log(chalk.cyan(`Or copy the URL above to download manually\n`))
    } catch (error) {
      if (options.json) {
        console.log(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }, null, 2))
        process.exit(1)
      } else {
        console.error(chalk.red(`\n❌ Error: ${error instanceof Error ? error.message : String(error)}\n`))
      }
    }
  })

// 下载命令
program
  .command("download <id>")
  .description("Download a level by ID")
  .option("-o, --output <path>", "Output directory", path.join(process.env.HOME || process.env.USERPROFILE || "~", "Downloads", "TUFCLi"))
  .option("--json", "Output results as JSON")
  .action(async (id, options) => {
    try {
      const filePath = await downloadLevel(parseInt(id), options.output)
      
      // JSON 输出模式
      if (options.json) {
        console.log(JSON.stringify({ success: true, filePath }, null, 2))
        return
      }
      
      // 人类可读模式
      console.log(chalk.cyan(`\n⬇ Downloading level ${id}...\n`))
      console.log(chalk.green(`✓ Download complete!`))
      console.log(chalk.white(`Saved to: ${filePath}\n`))
    } catch (error) {
      if (options.json) {
        console.log(JSON.stringify({ success: false, error: error instanceof Error ? error.message : String(error) }, null, 2))
        process.exit(1)
      } else {
        console.error(chalk.red(`\n❌ Error: ${error instanceof Error ? error.message : String(error)}\n`))
      }
    }
  })

// 列出热门关卡
program
  .command("popular")
  .description("Show popular levels")
  .option("-l, --limit <number>", "Number of results to show", "10")
  .option("--json", "Output results as JSON")
  .action(async (options) => {
    try {
      const limit = parseInt(options.limit)
      const result = await searchLevels({
        sort: "downloads",
        order: "desc",
        limit,
      })
      
      // JSON 输出模式
      if (options.json) {
        console.log(JSON.stringify(result, null, 2))
        return
      }
      
      // 人类可读模式
      console.log(chalk.cyan(`\n🔥 Fetching popular levels...\n`))
      
      if (result.results.length === 0) {
        console.log(chalk.yellow("No levels found."))
        return
      }
      
      console.log(chalk.green(`Top ${result.results.length} levels:\n`))
      
      result.results.forEach((level, index) => {
        console.log(chalk.bold(`${index + 1}. ${level.song}`))
        console.log(chalk.gray(`   Artist: ${level.artist} | Mapper: ${level.creator}`))
        console.log(chalk.yellow(`   Difficulty: ${level.difficulty.name} | Downloads: ${level.downloadCount}`))
        console.log(chalk.blue(`   ID: ${level.id}`))
        console.log()
      })
    } catch (error) {
      if (options.json) {
        console.log(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }, null, 2))
        process.exit(1)
      } else {
        console.error(chalk.red(`\n❌ Error: ${error instanceof Error ? error.message : String(error)}\n`))
      }
    }
  })

program.parse()
