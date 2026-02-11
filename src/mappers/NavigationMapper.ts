const { createCanvas, loadImage } = require('canvas');
import path from 'path';
import fs from 'fs-extra';
import { configService } from '../services/ConfigService';
import { logger } from '../services/LoggerService';

const generateSpeedLimitImage = (limit: number): string => {
    try {
        const canvas = createCanvas(300, 300);
        const ctx = canvas.getContext('2d');

        // Draw Circle Background
        ctx.beginPath();
        ctx.arc(150, 150, 140, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();

        if (limit > 0) {
            // Standard Speed Limit (Red Border)
            ctx.lineWidth = 30;
            ctx.strokeStyle = '#cc0000';
            ctx.stroke();

            // Draw Text
            ctx.font = 'bold 160px Arial';
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(limit.toString(), 150, 150);
        } else {
            // No Speed Limit / End of Limit (Grey Border + Diagonal lines)
            ctx.lineWidth = 8;
            ctx.strokeStyle = '#444';
            ctx.stroke();

            // Draw 5 diagonal lines (typical "End of Limit" sign style)
            ctx.strokeStyle = '#444';
            ctx.lineWidth = 15;
            for (let i = -2; i <= 2; i++) {
                const offset = i * 40;
                ctx.beginPath();
                // We use a bit of trigonometry to find points on the circle, 
                // but a simple clip() + lines is easier.
                ctx.save();
                ctx.beginPath();
                ctx.arc(150, 150, 140, 0, 2 * Math.PI);
                ctx.clip();

                ctx.moveTo(50 + offset, 250 + offset);
                ctx.lineTo(250 + offset, 50 + offset);
                ctx.stroke();
                ctx.restore();
            }
        }

        return canvas.toBuffer('image/png').toString('base64');

    } catch (e) {
        logger.error(`Error generating speed limit image: ${e}`);
        return '';
    }
}

export const mapNavigationStates = async (telemetry: any) => {
    // telemetry flat
    const states: { id: string, value: string }[] = [];

    // Check basic presence of something
    // routeDistance is 0 if no route? 
    // Use basics from config
    const basics = configService.userCfg.Basics;

    let speedLimit = telemetry.speedLimit;
    let dist = telemetry.routeDistance;
    let time = telemetry.routeTime;

    // SpeedLimit conversion
    if (basics.unit === 'Miles') {
        speedLimit = Math.round(speedLimit * 2.236936);
    } else {
        speedLimit = Math.round(speedLimit * 3.6);
    }

    // Speed Limit Image
    const speedLimitBase64 = await generateSpeedLimitImage(speedLimit);
    states.push({ id: 'Nybo.ETS2.Navigation.SpeedLimit', value: speedLimit.toString() });
    states.push({ id: 'Nybo.ETS2.Navigation.SpeedLimitSign', value: speedLimitBase64 });

    // 2. Distance and Progress
    let distKm = dist / 1000;
    let distanceStr = '';
    if (basics.unit === 'Miles') {
        const miles = dist / 1609.344;
        distanceStr = `${miles.toFixed(2)} Miles`;
    } else {
        distanceStr = `${distKm.toFixed(2)} KM`;
    }
    states.push({ id: 'Nybo.ETS2.Navigation.estimatedDistance', value: distanceStr });

    // Progress Calculation
    const plannedKm = telemetry.plannedDistanceKm || 0;
    let progress = 0;
    if (plannedKm > 0) {
        progress = Math.max(0, Math.min(100, Math.round(((plannedKm - distKm) / plannedKm) * 100)));
    }
    states.push({ id: 'Nybo.ETS2.Navigation.Progress', value: `${progress}%` });

    // 3. Timing (Remaining Time & absolute ETA)
    const absTimeMinutes = telemetry.timeAbs || 0; // minutes since Monday 00:00

    if (time > 0) {
        const t = Math.floor(time); // seconds
        const days = Math.floor(t / (24 * 3600));
        const hours = Math.floor((t % (24 * 3600)) / 3600);
        const mins = Math.floor((t % 3600) / 60);

        states.push({ id: 'Nybo.ETS2.Navigation.estimatedTime', value: `${days}D, ${hours}:${mins.toString().padStart(2, '0')}` });

        // ETA Calculation
        const arrivalMinutes = absTimeMinutes + Math.floor(time / 60);
        const totalDays = Math.floor(arrivalMinutes / (24 * 60));
        const dayOfWeek = totalDays % 7;
        const arrivalHour = Math.floor((arrivalMinutes % (24 * 60)) / 60);
        const arrivalMin = Math.floor(arrivalMinutes % 60);

        const dayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
        const etaStr = `${dayNames[dayOfWeek]} ${arrivalHour.toString().padStart(2, '0')}:${arrivalMin.toString().padStart(2, '0')}`;
        states.push({ id: 'Nybo.ETS2.Navigation.ETA', value: etaStr });
    } else {
        states.push({ id: 'Nybo.ETS2.Navigation.estimatedTime', value: '0D, 00:00' });
        states.push({ id: 'Nybo.ETS2.Navigation.ETA', value: '-' });
    }

    return states;
};
