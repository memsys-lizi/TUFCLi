#!/usr/bin/env node
import { Command } from "commander"
import { searchLevels, getLevelById, downloadLevel } from "./services/api.js"
import chalk from "chalk"

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
  .action(async (query, options) => {
    console.log(chalk.cyan(`\n🔍 Searching for: ${query}...\n`))
    
    const limit = parseInt(options.limit)
    const result = await searchLevels(query, 1, limit)
    
    if (result.levels.length === 0) {
      console.log(chalk.yellow("No results found."))
      return
    }
    
    console.log(chalk.green(`Found ${result.total} results (showing ${result.levels.length}):\n`))
    
    result.levels.forEach((level, index) => {
      console.log(chalk.bold(`${index + 1}. ${level.title}`))
      console.log(chalk.gray(`   Artist: ${level.artist}`))
      console.log(chalk.gray(`   Mapper: ${level.author}`))
      console.log(chalk.yellow(`   Difficulty: ${"★".repeat(Math.floor(level.difficulty / 4))} ${level.difficulty}/20`))
      console.log(chalk.gray(`   Downloads: ${level.downloads}`))
      console.log(chalk.blue(`   ID: ${level.id}`))
      console.log()
    })
    
    console.log(chalk.cyan(`Use 'tufcli info <id>' to see more details`))
    console.log(chalk.cyan(`Use 'tufcli download <id>' to download a level\n`))
  })

// 详情命令
program
  .command("info <id>")
  .description("Show detailed information about a level")
  .action(async (id) => {
    console.log(chalk.cyan(`\n📋 Fetching level details...\n`))
    
    const level = await getLevelById(parseInt(id))
    
    if (!level) {
      console.log(chalk.red("Level not found."))
      return
    }
    
    console.log(chalk.bold.cyan("=".repeat(60)))
    console.log(chalk.bold(`🎵 ${level.title}`))
    console.log(chalk.bold.cyan("=".repeat(60)))
    console.log()
    console.log(chalk.white(`Artist:      ${level.artist}`))
    console.log(chalk.white(`Mapper:      ${level.author}`))
    console.log(chalk.yellow(`Difficulty:  ${"★".repeat(Math.floor(level.difficulty / 4))} ${level.difficulty}/20`))
    console.log(chalk.white(`Downloads:   ${level.downloads}`))
    if (level.rating) {
      console.log(chalk.white(`Rating:      ${level.rating}/5 ⭐`))
    }
    console.log()
    
    if (level.description) {
      console.log(chalk.bold("Description:"))
      console.log(chalk.gray(level.description))
      console.log()
    }
    
    if (level.tags && level.tags.length > 0) {
      console.log(chalk.bold("Tags:"))
      console.log(chalk.cyan(level.tags.map(tag => `#${tag}`).join(" ")))
      console.log()
    }
    
    console.log(chalk.bold.cyan("=".repeat(60)))
    console.log(chalk.cyan(`\nUse 'tufcli download ${id}' to download this level\n`))
  })

// 下载命令
program
  .command("download <id>")
  .description("Download a level by ID")
  .option("-o, --output <path>", "Output directory", "./downloads")
  .action(async (id, options) => {
    console.log(chalk.cyan(`\n⬇ Downloading level ${id}...\n`))
    
    const level = await getLevelById(parseInt(id))
    
    if (!level) {
      console.log(chalk.red("Level not found."))
      return
    }
    
    console.log(chalk.white(`Title: ${level.title}`))
    console.log(chalk.white(`Output: ${options.output}\n`))
    
    const success = await downloadLevel(level.url, options.output)
    
    if (success) {
      console.log(chalk.green(`✓ Download complete!\n`))
    } else {
      console.log(chalk.red(`✗ Download failed.\n`))
    }
  })

// 列出热门关卡
program
  .command("popular")
  .description("Show popular levels")
  .option("-l, --limit <number>", "Number of results to show", "10")
  .action(async (options) => {
    console.log(chalk.cyan(`\n🔥 Fetching popular levels...\n`))
    
    // 使用空查询获取所有关卡（或者可以改为按下载量排序）
    const limit = parseInt(options.limit)
    const result = await searchLevels("", 1, limit)
    
    if (result.levels.length === 0) {
      console.log(chalk.yellow("No levels found."))
      return
    }
    
    console.log(chalk.green(`Top ${result.levels.length} levels:\n`))
    
    result.levels.forEach((level, index) => {
      console.log(chalk.bold(`${index + 1}. ${level.title}`))
      console.log(chalk.gray(`   Artist: ${level.artist} | Mapper: ${level.author}`))
      console.log(chalk.yellow(`   Difficulty: ${level.difficulty}/20 | Downloads: ${level.downloads}`))
      console.log(chalk.blue(`   ID: ${level.id}`))
      console.log()
    })
  })

program.parse()
