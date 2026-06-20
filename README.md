# TUF CLI - The Universal Forums Level Downloader

A beautiful terminal user interface (TUI) for browsing and downloading levels from The Universal Forums.

## Features

- 🎨 Beautiful TUI interface with rounded borders
- 🔍 Search and browse levels
- 📊 View level details (difficulty, BPM, tags, etc.)
- 📥 Download levels as ZIP files
- 🤖 CLI commands for automation

## Installation

```bash
npm install
npm run build
```

## Usage

### Interactive TUI Mode

Launch the interactive interface:

```bash
npm run dev
# or after build:
node dist/cli.js
```

### CLI Commands

**Search for levels:**
```bash
node dist/cli.js search "freedom" --difficulty=50-100 --tags="Tech" --limit=20 --output=json
```

**Get level details:**
```bash
node dist/cli.js detail 14919 --output=json
```

**Get download link:**
```bash
node dist/cli.js download 14919 --get-link
```

**Download a level:**
```bash
node dist/cli.js download 14919 --path="./downloads"
```

## Keyboard Shortcuts

- `↑↓` - Navigate through levels
- `Enter` - Select level
- `Esc` - Go back
- `Q` - Quit application

## Project Structure

```
src/
├── api/           # API client and types
├── commands/      # CLI command handlers
├── components/    # React TUI components
├── utils/         # Utility functions
├── App.tsx        # Main TUI application
└── cli.tsx        # CLI entry point
```

## Development

```bash
npm run dev    # Run in development mode
npm run build  # Build for production
```

## License

MIT
