const fs = require('fs')
const fse = require('fs-extra')
const AdmZip = require("adm-zip");

fse.renameSync('./tmp/ETS2_Dashboard.tpp', './tmp/ETS2_Dashboard.zip', { overwrite: true })

var zip = new AdmZip("./tmp/ETS2_Dashboard.zip");

zip.extractAllTo('./tmp/', true)
fs.unlinkSync('./tmp/ETS2_Dashboard.zip') 

var tmp_path = "./tmp/ETS2_Dashboard"
var server_folder = `server`
var images_folder = `images`
var entry_file = `entry.tp`
var main_exe = `index.exe`
var config_file = `config.json`

console.log(fs.existsSync(`${tmp_path}/${server_folder}`))

if(fs.existsSync(`${tmp_path}/${server_folder}`))  { fse.move(`${tmp_path}/${server_folder}`, `./${server_folder}`,   { overwrite: true },    err => { if(err) return console.log(err) }) }
if(fs.existsSync(`${tmp_path}/${images_folder}`))  { fse.move(`${tmp_path}/${images_folder}`, `./${images_folder}`,   { overwrite: true },    err => { if(err) return console.log(err) }) }
if(fs.existsSync(`${tmp_path}/${entry_file}`))     { fse.move(`${tmp_path}/${entry_file}`,    `./${entry_file}`,      { overwrite: true },    err => { if(err) return console.log(err) }) }
if(fs.existsSync(`${tmp_path}/${main_exe}`))       { fse.move(`${tmp_path}/${main_exe}`,      `./${main_exe}`,        { overwrite: true },    err => { if(err) return console.log(err) }) }
if(fs.existsSync(`${tmp_path}/${config_file}`))    { fse.move(`${tmp_path}/${config_file}`,   `./${config_file}`,     { overwrite: true },    err => { if(err) return console.log(err) }) }
    
