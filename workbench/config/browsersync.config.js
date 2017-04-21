/*******************************
    BROWSER-SYNC -  CONFIG
********************************/

var config = {
  server: "./www",
  port: 3010,
  ui: {
    port: 3011
  },
  files: [
    '../armstrong/dist',
    'www'
  ]
}

module.exports = config;
