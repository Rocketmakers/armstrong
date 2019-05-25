/*******************************
    BROWSER-SYNC -  CONFIG
********************************/
var historyFallback = require('connect-history-api-fallback')

var config = {
  watch: true,
  server: {
    baseDir: "out",
    index: "index.htm;",
    middleware: [
      historyFallback()
    ]
  },
  open: false,
  port: 3320,
  ui: false
}

module.exports = config;
