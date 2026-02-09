import { createCanvas, Canvas, CanvasRenderingContext2D } from 'canvas';
import { configService } from '../services/ConfigService';
import { logger } from '../services/LoggerService';

// Constants for Gauge Appearance
const GAUGE_WIDTH = 400;
const GAUGE_HEIGHT = 400;
const CENTER_X = GAUGE_WIDTH / 2;
const CENTER_Y = GAUGE_HEIGHT / 2;
const RADIUS = 180;

// Helper to create patterns
const createPattern = (ctx: any, type: string, color: string) => {
    if (type === 'grid') {
        const patternCanvas = createCanvas(20, 20);
        const pCtx = patternCanvas.getContext('2d');
        pCtx.strokeStyle = '#333';
        pCtx.lineWidth = 1;
        pCtx.beginPath();
        pCtx.moveTo(0, 0); pCtx.lineTo(20, 0);
        pCtx.moveTo(0, 0); pCtx.lineTo(0, 20);
        pCtx.stroke();
        return ctx.createPattern(patternCanvas, 'repeat');
    } else if (type === 'carbon') {
        const patternCanvas = createCanvas(10, 10);
        const pCtx = patternCanvas.getContext('2d');
        pCtx.fillStyle = '#222';
        pCtx.fillRect(0, 0, 10, 10);
        pCtx.fillStyle = '#333';
        pCtx.fillRect(0, 0, 5, 5);
        pCtx.fillRect(5, 5, 5, 5);
        return ctx.createPattern(patternCanvas, 'repeat');
    }
    return color; // Fallback to solid color
};

// Helper to draw a generic gauge background
const drawGaugeBackground = (ctx: any, title: string, min: number, max: number, steps: number, unit: string, isFuel: boolean = false) => {
    const design = configService.designCfg.gauge;

    ctx.save();

    // Background Shape & Pattern
    ctx.beginPath();

    if (design.shape === 'square') {
        // Rounded Square
        const r = 40;
        const x = 20;
        const y = 20;
        const w = GAUGE_WIDTH - 40;
        const h = GAUGE_HEIGHT - 40;
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
    } else {
        // Circle (Default)
        ctx.arc(CENTER_X, CENTER_Y, RADIUS, 0, 2 * Math.PI);
    }

    // Fill with Pattern or Color
    if (design.backgroundPattern && design.backgroundPattern !== 'none') {
        ctx.fillStyle = design.backgroundColor;
        ctx.fill(); // Base fill
        const pattern = createPattern(ctx, design.backgroundPattern, design.backgroundColor);
        if (pattern) {
            ctx.fillStyle = pattern;
            ctx.fill();
        }
    } else {
        ctx.fillStyle = design.backgroundColor;
        ctx.fill();
    }

    ctx.lineWidth = 5;
    ctx.strokeStyle = design.borderColor;
    ctx.stroke();

    ctx.restore();

    // Ticks and Numbers
    const startAngle = 0.75 * Math.PI; // 135 degrees
    const endAngle = 2.25 * Math.PI;   // 405 degrees
    const totalAngle = endAngle - startAngle;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold 20px ${design.fontFamily}`;
    ctx.fillStyle = design.textColor;

    for (let i = 0; i <= steps; i++) {
        const percent = i / steps;
        const angle = startAngle + (percent * totalAngle);

        // Tick position
        const x1 = CENTER_X + (RADIUS - 20) * Math.cos(angle);
        const y1 = CENTER_Y + (RADIUS - 20) * Math.sin(angle);
        const x2 = CENTER_X + (RADIUS - 10) * Math.cos(angle);
        const y2 = CENTER_Y + (RADIUS - 10) * Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = 3;
        ctx.strokeStyle = design.tickColor;
        ctx.stroke();

        // Text position
        // For Fuel, we want E, 1/2, F.
        // steps should be 2. i=0(E), i=1(1/2), i=2(F)
        if (isFuel) {
            let label = '';
            if (i === 0) label = 'E';
            else if (i === steps / 2) label = '1/2'; // Assuming steps=2 or even
            else if (i === steps) label = 'F';

            if (label) {
                const tx = CENTER_X + (RADIUS - 40) * Math.cos(angle);
                const ty = CENTER_Y + (RADIUS - 40) * Math.sin(angle);
                ctx.fillText(label, tx, ty);
            }

        } else {
            // Normal number logic
            const value = min + (i * ((max - min) / steps));
            if (i % 2 === 0) { // Number every 2nd step
                const tx = CENTER_X + (RADIUS - 40) * Math.cos(angle);
                const ty = CENTER_Y + (RADIUS - 40) * Math.sin(angle);
                ctx.fillText(Math.round(value).toString(), tx, ty);
            }
        }
    }

    // Title
    ctx.font = `bold 24px ${design.fontFamily}`;
    ctx.fillStyle = design.titleColor;
    ctx.fillText(title, CENTER_X, CENTER_Y - 50);

    // Unit
    ctx.font = `18px ${design.fontFamily}`;
    ctx.fillStyle = design.unitColor;
    ctx.fillText(unit, CENTER_X, CENTER_Y + 80);
};

const drawNeedle = (ctx: any, value: number, min: number, max: number) => {
    const design = configService.designCfg.gauge;
    const startAngle = 0.75 * Math.PI;
    const endAngle = 2.25 * Math.PI;
    const totalAngle = endAngle - startAngle;

    // Clamp value
    const v = Math.min(Math.max(value, min), max);
    const percent = (v - min) / (max - min);
    const angle = startAngle + (percent * totalAngle);

    ctx.save();
    ctx.translate(CENTER_X, CENTER_Y);
    ctx.rotate(angle);

    ctx.beginPath();
    ctx.fillStyle = design.needleColor;

    if (design.needleShape === 'sport') {
        // Sport Needle: Tapered, sharper
        ctx.moveTo(0, -3);
        ctx.lineTo(RADIUS - 10, 0); // Long tip
        ctx.lineTo(0, 3);
    } else {
        // Classic Needle
        // Draw Needle pointing RIGHT (0 radians) by default
        ctx.moveTo(0, -5);
        ctx.lineTo(RADIUS - 30, 0);
        ctx.lineTo(0, 5);
    }

    ctx.fill();

    // Center cap
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, 2 * Math.PI);
    ctx.fillStyle = design.borderColor;
    ctx.fill();
    ctx.stroke();

    ctx.restore();
};

// Non-Linear Speed Angle Calculation
// 0-100 kmh: Stretched (10kmh takes Space X)
// 100+ kmh: Compressed (20kmh takes Space X)
const getSpeedAngle = (value: number, max: number, startAngle: number, totalAngle: number) => {
    // We strictly assume KMH logic with Breakpoint 100
    const breakpoint = 100;

    // Calculate "Virtual Units" to normalize density
    // Range 1 (0-70) counts as full weight (1.0 per unit)
    // Range 2 (70-Max) counts as half weight (0.5 per unit) because 20 units takes same space as 10 units
    // Actually: 10 units in R1 = Space S. 1 unit = S/10.
    // 20 units in R2 = Space S. 1 unit = S/20.
    // Ratio Density R1/R2 = (S/10) / (S/20) = 2.
    // So R1 is 2x denser than R2.

    // Total "Density Units"
    // Range 1: 70 * 2 = 140 virtual units
    // Range 2: (Max - 70) * 1 = virtual units
    const range1Size = breakpoint;
    const range2Size = max - breakpoint;

    // Let's use specific weights:
    // Scale 1 (0-100): weight 2
    // Scale 2 (100-max): weight 1
    const weight1 = 2;
    const weight2 = 1;

    const totalWeightedUnits = (range1Size * weight1) + (range2Size * weight2);
    const anglePerWeightedUnit = totalAngle / totalWeightedUnits;

    // Calculate Angle
    let angle = startAngle;
    let v = Math.min(Math.max(value, 0), max);

    if (v <= breakpoint) {
        angle += v * weight1 * anglePerWeightedUnit;
    } else {
        angle += (breakpoint * weight1 * anglePerWeightedUnit); // Full Range 1
        angle += (v - breakpoint) * weight2 * anglePerWeightedUnit; // Part of Range 2
    }

    return angle;
};

// Custom Speedometer Background (Realistic Style)
const drawSpeedometerBackground = (ctx: any, max: number, unit: string) => {
    const design = configService.designCfg.gauge;
    const isKmh = unit === 'KM/H';

    // 1. Draw Base (Shape/Pattern)
    ctx.save();
    ctx.beginPath();
    if (design.shape === 'square') {
        const r = 40; const x = 20; const y = 20; const w = GAUGE_WIDTH - 40; const h = GAUGE_HEIGHT - 40;
        ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
    } else {
        ctx.arc(CENTER_X, CENTER_Y, RADIUS, 0, 2 * Math.PI);
    }

    if (design.backgroundPattern && design.backgroundPattern !== 'none') {
        ctx.fillStyle = design.backgroundColor; ctx.fill();
        const pattern = createPattern(ctx, design.backgroundPattern, design.backgroundColor);
        if (pattern) { ctx.fillStyle = pattern; ctx.fill(); }
    } else {
        ctx.fillStyle = design.backgroundColor; ctx.fill();
    }
    ctx.lineWidth = 5; ctx.strokeStyle = design.borderColor; ctx.stroke();
    ctx.restore();

    // 2. Ticks & Labels
    const startAngle = 0.75 * Math.PI; // 135 deg
    const endAngle = 2.25 * Math.PI;   // 405 deg
    const totalAngle = endAngle - startAngle;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold 18px ${design.fontFamily}`;
    ctx.fillStyle = design.textColor;

    // We iterate through value space, calculate mapped angle
    // Step: 2kmh
    // If not KMH (MPH), we probably strip this logic? 
    // User requested specifically for "Speed Gauge" context which usually implies KMH in this strict request.
    // If MPH, we default to linear?

    const step = 2;

    for (let v = 0; v <= max; v += step) {

        let angle: number;
        if (isKmh) {
            angle = getSpeedAngle(v, max, startAngle, totalAngle);
        } else {
            // Linear fallback for MPH
            const percent = v / max;
            angle = startAngle + (percent * totalAngle);
        }

        // Minor/Major logic
        // 0-70: Major every 10
        // 70+: Major every 20? 
        // User said: "Ab da dann 20er schritten" for LABELS.
        // But Ticks? Usually ticks remain consistent or follow the grid.
        // Let's keep Major Ticks every 10 globally, but only LABEL specific ones.
        // OR: Major ticks every 10 in R1, Major ticks every 20 in R2?
        // Let's do Major every 10 globally for ticks, but label selectively.

        const isMajor = v % 10 === 0;

        // Draw Ticks
        ctx.beginPath();
        const outerR = RADIUS - 10;
        const innerR = isMajor ? RADIUS - 25 : RADIUS - 18;

        const x1 = CENTER_X + innerR * Math.cos(angle);
        const y1 = CENTER_Y + innerR * Math.sin(angle);
        const x2 = CENTER_X + outerR * Math.cos(angle);
        const y2 = CENTER_Y + outerR * Math.sin(angle);

        ctx.lineWidth = isMajor ? 3 : 1;
        ctx.strokeStyle = design.tickColor;
        ctx.globalAlpha = isMajor ? 1.0 : 0.6;

        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.globalAlpha = 1.0;

        // Labels
        if (isMajor) {
            let showLabel = false;

            if (isKmh) {
                if (v <= 100) {
                    // 0..100: Show every 10
                    showLabel = true;
                } else {
                    // >100: Show every 20 (120, 140...)
                    if ((v - 100) % 20 === 0) showLabel = true;
                }
            } else {
                // MPH: Every 10
                if (v % 20 === 0) showLabel = true; // Less crowded for MPH
            }

            if (showLabel) {
                const textR = RADIUS - 45;
                const tx = CENTER_X + textR * Math.cos(angle);
                const ty = CENTER_Y + textR * Math.sin(angle);
                ctx.fillText(v.toString(), tx, ty);
            }
        }
    }

    // Title
    ctx.font = `bold 24px ${design.fontFamily}`;
    ctx.fillStyle = design.titleColor;
    ctx.fillText("SPEED", CENTER_X, CENTER_Y - 50);

    // Unit
    ctx.font = `18px ${design.fontFamily}`;
    ctx.fillStyle = design.unitColor;
    ctx.fillText(unit, CENTER_X, CENTER_Y + 80);
};

const drawSpeedNeedle = (ctx: any, value: number, max: number, unit: string) => {
    const design = configService.designCfg.gauge;
    const startAngle = 0.75 * Math.PI;
    const endAngle = 2.25 * Math.PI;
    const totalAngle = endAngle - startAngle;

    let angle: number;
    if (unit === 'KM/H') {
        angle = getSpeedAngle(value, max, startAngle, totalAngle);
    } else {
        const v = Math.min(Math.max(value, 0), max);
        const percent = v / max;
        angle = startAngle + (percent * totalAngle);
    }

    ctx.save();
    ctx.translate(CENTER_X, CENTER_Y);
    ctx.rotate(angle);

    ctx.beginPath();
    ctx.fillStyle = design.needleColor;

    if (design.needleShape === 'sport') {
        ctx.moveTo(0, -3);
        ctx.lineTo(RADIUS - 10, 0);
        ctx.lineTo(0, 3);
    } else {
        ctx.moveTo(0, -5);
        ctx.lineTo(RADIUS - 30, 0);
        ctx.lineTo(0, 5);
    }

    ctx.fill();

    // Center cap
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, 2 * Math.PI);
    ctx.fillStyle = design.borderColor;
    ctx.fill();
    ctx.stroke();

    ctx.restore();
};

const getSpeedGauge = (speed: number, unit: string) => {
    const design = configService.designCfg.gauge;
    const canvas = createCanvas(GAUGE_WIDTH, GAUGE_HEIGHT);
    const ctx = canvas.getContext('2d');

    const isMiles = unit === 'miles';
    // Max need to accommodate the 20s step logic niceley.
    // 100 + 6 * 20 = 220.
    const max = isMiles ? 130 : 220;

    drawSpeedometerBackground(ctx, max, isMiles ? 'MPH' : 'KM/H');

    // Dynamic Speed Text
    ctx.font = `bold 40px ${design.fontFamily}`;
    ctx.fillStyle = design.textColor;
    ctx.textAlign = 'center';
    ctx.fillText(Math.round(speed).toString(), CENTER_X, CENTER_Y + 120);

    drawSpeedNeedle(ctx, speed, max, isMiles ? 'MPH' : 'KM/H');

    return canvas.toBuffer('image/png').toString('base64');
};

const getRPMGauge = (rpm: number, maxRpm: number) => {
    const design = configService.designCfg.gauge;
    const canvas = createCanvas(GAUGE_WIDTH, GAUGE_HEIGHT);
    const ctx = canvas.getContext('2d');

    // Use telemetry max, default to 3000 if 0 or missing
    const max = maxRpm > 0 ? maxRpm : 3000;

    drawGaugeBackground(ctx, 'RPM', 0, max, 10, 'RPM');

    // Draw Red Zone (Last 10%)
    const startAngle = 0.75 * Math.PI; // 135 degrees
    const endAngle = 2.25 * Math.PI;   // 405 degrees
    const totalAngle = endAngle - startAngle;

    const redZoneStart = startAngle + (0.9 * totalAngle);

    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, RADIUS - 10, redZoneStart, endAngle);
    ctx.lineWidth = 15;
    ctx.strokeStyle = design.redZoneColor || '#cc0000'; // Fallback just in case
    ctx.stroke();

    drawNeedle(ctx, rpm, 0, max);

    // Dynamic Text
    ctx.font = `bold 30px ${design.fontFamily}`;
    ctx.fillStyle = design.textColor;
    ctx.textAlign = 'center';
    ctx.fillText(Math.round(rpm).toString(), CENTER_X, CENTER_Y + 120);

    return canvas.toBuffer('image/png').toString('base64');
};

const getFuelGauge = (fuel: number, capacity: number) => {
    const design = configService.designCfg.gauge;
    const canvas = createCanvas(GAUGE_WIDTH, GAUGE_HEIGHT);
    const ctx = canvas.getContext('2d');

    // Fuel Gauge: E - 1/2 - F
    // Steps = 2 (0=E, 1=1/2, 2=F)
    drawGaugeBackground(ctx, 'FUEL', 0, capacity, 2, '', true);

    drawNeedle(ctx, fuel, 0, capacity);

    // Dynamic Text (Show Liters still? Or just rely on needle? User said "Typische Füllstandsanzeige")
    // Usually car dashboards don't show liters. But showing it below is useful info.
    // Let's keep it smaller.
    ctx.font = `bold 24px ${design.fontFamily}`;
    ctx.fillStyle = design.textColor;
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(fuel)} L`, CENTER_X, CENTER_Y + 120);

    return canvas.toBuffer('image/png').toString('base64');
};

export const mapGaugeStates = async (telemetry: any) => {
    const states: { id: string, value: string }[] = [];
    const basics = configService.userCfg.Basics;
    const unit = basics.unit.toLowerCase();

    // Speed (telemetry.speed is m/s)
    let speed = telemetry.speed;
    if (unit === 'miles') {
        speed = speed * 2.236936;
    } else {
        // Default km/h
        speed = speed * 3.6;
    }
    if (speed < 0) speed = Math.abs(speed);

    // RPM
    const rpm = telemetry.engineRpm;
    const maxRpm = telemetry.engineRpmMax;

    // Fuel
    const fuel = telemetry.fuel;
    const capacity = telemetry.fuelCapacity;

    states.push({ id: 'Nybo.ETS2.Gauges.SpeedGauge', value: getSpeedGauge(speed, unit) });
    states.push({ id: 'Nybo.ETS2.Gauges.RPMGauge', value: getRPMGauge(rpm, maxRpm) });
    states.push({ id: 'Nybo.ETS2.Gauges.FuelGauge', value: getFuelGauge(fuel, capacity) });

    return states;
}
