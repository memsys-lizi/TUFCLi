# TUFCLi - The Universal Forums CLI

A simple command-line tool for browsing and downloading ADOFAI (A Dance of Fire and Ice) levels from The Universal Forums.

## Features

- 🔍 Search levels by name, artist, or mapper
- 📋 View detailed level information
- ⬇️ Download levels directly from terminal
- 🔥 Browse popular levels
- 🎨 Colorful CLI output with Chalk

## Technology Stack

- **TypeScript** - Type-safe code
- **Commander.js** - CLI framework
- **Chalk** - Terminal styling
- **Axios** - HTTP client

## Installation

```bash
npm install
```

## Usage

### Search for levels
```bash
npm run dev search "freedom dive"
npm run dev search "xi" --limit 20
```

### View level details
```bash
npm run dev info 1
```

### Download a level
```bash
npm run dev download 1
npm run dev download 1 --output ./my-levels
```

### Browse popular levels
```bash
npm run dev popular
npm run dev popular --limit 20
```

## Commands

- `search <query>` - Search for levels by name, artist, or author
  - `-l, --limit <number>` - Number of results to show (default: 10)

- `info <id>` - Show detailed information about a level

- `download <id>` - Download a level by ID
  - `-o, --output <path>` - Output directory (default: ./downloads)

- `popular` - Show popular levels
  - `-l, --limit <number>` - Number of results to show (default: 10)

## Project Structure

```
src/
  ├── cli.ts              # Main CLI entry point
  └── services/
      └── api.ts          # API service with mock data
```

## Build

```bash
npm run build
```

## Notes

- The API service includes mock data for demonstration
- Real API integration at `https://api.rhythm.cafe` (if available)
- Downloads are simulated in the current implementation

## License

MIT

