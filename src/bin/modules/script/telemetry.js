// Import Writing Modules
const fs = require(`fs`)
const sJSON = require('self-reload-json')
// Import Internet Modules
const http = require(`request`);
// Import System Modules
const { exec, execFile } = require(`child_process`)
// Custom Modules
const timeout = require('./timeout')
const { logger } = require('./logger')
const { spawn } = require('child_process');
const pluginEvents = require('../script/emitter')

const telemetry_Server = async (path, telemetry_path, refreshInterval) => {

    const CheckTelemetryEXE = () => {
        return new Promise((resolve) => {
            const child = spawn('tasklist', ['/FI', 'IMAGENAME eq Ets2Telemetry.exe']);

            child.stdout.on('data', (data) => {
                if (data.toString().indexOf('Ets2Telemetry.exe') !== -1) {
                    logger.info('[TELEMETRY] Telemetry task is now running')
                    resolve(true)
                }
            });

            child.on('exit', () => {
                resolve(false)
            });
        });
    };

    const startTelemetryServer = () => {
        const child = spawn(`${path}/server/Ets2Telemetry.exe`, {
            windowsHide: true 
        });

        child.on('exit', (code, signal) => {
            startTelemetryServer();
        });
    };

    const Telemetry = () => {
        CheckTelemetryEXE().then(async (running) => {
            if (running) {
                pluginEvents.emit(`telemetryRequest`)
            } else {
                logger.info('[TELEMETRY] Telemetry task is not running');
                startTelemetryServer();
                await timeout(2000)
                Telemetry()
            }
        }).catch((error) => {
            logger.error('[TELEMETRY] Error checking telemetry task:', error);
        });
    };

    Telemetry();
};


    
module.exports = telemetry_Server