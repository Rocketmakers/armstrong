const exec = require('child_process').exec;
const chokidar = require('chokidar');

const watcher = chokidar.watch(process.cwd() + "/source/**/*.scss", { persistent: true });
const log = console.log.bind(console);

watcher
  .on('ready', () => log(`Initial scan complete. Ready for changes`))
  .on('change', path => {
    log(`File ${path} has been changed`);
    exec("node ./sass_concat.js", (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`Scss: ${stdout}`);
      if (stderr) {
        console.log(`stderr: ${stderr}`);
      }
    });
  });