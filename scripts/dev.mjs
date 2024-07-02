import fs from 'fs';
import { spawn } from 'cross-spawn';
import chokidar from 'chokidar';


// Function to run a command and return a promise
function runCommand(command) {
    const parts = command.split(' ');
    const subprocess = spawn(parts[0], parts.slice(1), { stdio: 'inherit' });

    return new Promise((resolve, reject) => {
        subprocess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`${command} failed with code ${code}`));
                return;
            }
            resolve();
        });
    });
}

// Initial check and build if necessary
async function checkAndBuild(packageName, buildCommand) {
    if (fs.existsSync(`./packages/${packageName}/dist`)) return
    await runCommand(buildCommand); // Wait for build command to finish
}

// Initial build check and start dev server
// Check and build core and layout packages if necessary
await Promise.all([
    checkAndBuild('core', 'npm run build-core'),
    checkAndBuild('layout', 'npm run build-layout')
]);

// Watch for changes and trigger builds
chokidar.watch('./packages/core/src/**/*.{ts,tsx}').on('change', (path) => {
    runCommand('npm run build-core');
});

chokidar.watch('./packages/layout/src/**/*.{ts,tsx}').on('change', (path) => {
    runCommand('npm run build-layout');
});

// Start dev server
runCommand('npm run dev');