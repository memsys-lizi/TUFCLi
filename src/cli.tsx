#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import { Command } from 'commander';
import App from './App.js';
import { searchCommand } from './commands/search.js';
import { detailCommand } from './commands/detail.js';
import { downloadCommand } from './commands/download.js';

const program = new Command();

program
  .name('tufcli')
  .description('TUF Level Downloader - A beautiful TUI for The Universal Forums')
  .version('1.0.0');

// Add commands
program.addCommand(searchCommand);
program.addCommand(detailCommand);
program.addCommand(downloadCommand);

// Default: launch TUI
program.action(() => {
  render(<App />);
});

program.parse();
