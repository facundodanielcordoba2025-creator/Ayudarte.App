const { spawn } = require('child_process');
const nextProcess = spawn('node', ['node_modules/.bin/next', 'dev', '-p', '3000', '--webpack'], {
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
  stdio: 'inherit'
});
nextProcess.on('exit', (code) => console.log('Exited with', code));
