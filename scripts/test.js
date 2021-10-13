const fs = require('fs')
const { exit } = require('process')

fs.copyFileSync('./src/config.json', './config.json')
fs.copyFileSync('./src/userSettings.json', './userSettings.json')
fs.copyFileSync('./src/entry.tp', './entry.tp')

exit