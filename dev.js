#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');

// Configuration
const PORT = 5000;

console.log(`Starting Next.js development server on port ${PORT}...`);

// Command to run Next.js dev server
const nextCommand = `npx next dev -p ${PORT}`;

// Execute the command
const nextProcess = exec(nextCommand);

// Forward stdout and stderr
nextProcess.stdout.on('data', (data) => {
  process.stdout.write(data);
});

nextProcess.stderr.on('data', (data) => {
  process.stderr.write(data);
});

// Handle process exit
nextProcess.on('exit', (code) => {
  console.log(`Next.js process exited with code ${code}`);
  process.exit(code);
});

// Handle interrupts
process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down Next.js server...');
  nextProcess.kill('SIGINT');
});