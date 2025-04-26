const { spawn } = require('child_process');
const port = process.env.PORT || 5000;

// Start Next.js development server
const nextProcess = spawn('npx', ['next', 'dev', '-p', port, '--hostname', '0.0.0.0'], {
  stdio: 'inherit',
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Gracefully shutting down...');
  nextProcess.kill('SIGINT');
  process.exit(0);
});

nextProcess.on('close', (code) => {
  console.log(`Next.js process exited with code ${code}`);
  process.exit(code);
});