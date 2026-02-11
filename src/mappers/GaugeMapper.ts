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
const drawGaugeBackground = (ctx: any, title: string, min: number, max: number, steps: number, unit: string, design: any, isFuel: boolean = false) => {

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
    ctx.font = `bold ${Math.round(20 * design.scaleFontScale)}px ${design.fontFamily}`;
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
        const isMajor = i % 2 === 0; // In drawGaugeBackground, numbers are every 2nd step
        ctx.lineWidth = isMajor ? design.tickWidthMajor : design.tickWidthMinor;
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
    if (design.showLabel) {
        ctx.font = `bold ${Math.round(24 * design.titleFontScale)}px ${design.fontFamily}`;
        ctx.fillStyle = design.titleColor;
        ctx.fillText(title, CENTER_X, CENTER_Y - 50);
    }

    // Unit
    if (design.showUnit) {
        ctx.font = `${Math.round(18 * design.unitFontScale)}px ${design.fontFamily}`;
        ctx.fillStyle = design.unitColor;
        ctx.fillText(unit, CENTER_X, CENTER_Y + 80);
    }
};


const drawNeedle = (ctx: any, value: number, min: number, max: number, design: any) => {
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
        const nw = 3 * design.needleWidthScale;
        ctx.moveTo(0, -nw);
        ctx.lineTo(RADIUS - 10, 0);
        ctx.lineTo(0, nw);
    } else {
        const nw = 5 * design.needleWidthScale;
        ctx.moveTo(0, -nw);
        ctx.lineTo(RADIUS - 30, 0);
        ctx.lineTo(0, nw);
    }

    ctx.fill();

    // Center cap
    ctx.beginPath();
    ctx.arc(0, 0, 10 * design.needleWidthScale, 0, 2 * Math.PI);
    ctx.fillStyle = design.borderColor;
    ctx.fill();
    ctx.lineWidth = 2 * design.needleWidthScale;
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
const drawSpeedometerBackground = (ctx: any, max: number, unit: string, design: any) => {
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
    ctx.font = `bold ${Math.round(18 * design.scaleFontScale)}px ${design.fontFamily}`;
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

        ctx.lineWidth = isMajor ? design.tickWidthMajor : design.tickWidthMinor;
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
    if (design.showLabel) {
        ctx.font = `bold ${Math.round(24 * design.titleFontScale)}px ${design.fontFamily}`;
        ctx.fillStyle = design.titleColor;
        ctx.fillText("SPEED", CENTER_X, CENTER_Y - 50);
    }

    // Unit
    if (design.showUnit) {
        ctx.font = `${Math.round(18 * design.unitFontScale)}px ${design.fontFamily}`;
        ctx.fillStyle = design.unitColor;
        ctx.fillText(unit, CENTER_X, CENTER_Y + 80);
    }
};


const drawSpeedNeedle = (ctx: any, value: number, max: number, unit: string, design: any) => {
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
        const nw = 3 * design.needleWidthScale;
        ctx.moveTo(0, -nw);
        ctx.lineTo(RADIUS - 10, 0);
        ctx.lineTo(0, nw);
    } else {
        const nw = 5 * design.needleWidthScale;
        ctx.moveTo(0, -nw);
        ctx.lineTo(RADIUS - 30, 0);
        ctx.lineTo(0, nw);
    }

    ctx.fill();

    // Center cap
    ctx.beginPath();
    ctx.arc(0, 0, 10 * design.needleWidthScale, 0, 2 * Math.PI);
    ctx.fillStyle = design.borderColor;
    ctx.fill();
    ctx.lineWidth = 2 * design.needleWidthScale;
    ctx.stroke();

    ctx.restore();
};

const getSpeedGauge = (speed: number, unit: string) => {
    const design = configService.designCfg.speed;
    const canvas = createCanvas(GAUGE_WIDTH, GAUGE_HEIGHT);
    const ctx = canvas.getContext('2d');

    const isMiles = unit === 'miles';
    const max = isMiles ? 130 : 220;
    drawSpeedometerBackground(ctx, max, isMiles ? 'MPH' : 'KM/H', design);

    if (design.showNumber) {
        // Dynamic Speed Text
        ctx.font = `bold ${Math.round(40 * design.numberFontScale)}px ${design.fontFamily}`;
        ctx.fillStyle = design.textColor;
        ctx.textAlign = 'center';
        ctx.fillText(Math.round(speed).toString(), CENTER_X, CENTER_Y + 120);

        // Unit Text below number
        if (design.showUnit) {
            ctx.font = `${Math.round(16 * design.numberFontScale)}px ${design.fontFamily}`;
            ctx.fillText(isMiles ? 'MPH' : 'KM/H', CENTER_X, CENTER_Y + 150);
        }
    }

    drawSpeedNeedle(ctx, speed, max, isMiles ? 'MPH' : 'KM/H', design);

    return canvas.toBuffer('image/png').toString('base64');
};

const getRPMGauge = (rpm: number, maxRpm: number) => {
    const design = configService.designCfg.rpm;
    const canvas = createCanvas(GAUGE_WIDTH, GAUGE_HEIGHT);
    const ctx = canvas.getContext('2d');

    // Use telemetry max, default to 3000 if 0 or missing
    const max = maxRpm > 0 ? maxRpm : 3000;

    drawGaugeBackground(ctx, 'RPM', 0, max, 10, 'RPM', design);

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

    drawNeedle(ctx, rpm, 0, max, design);

    // Dynamic Text
    if (design.showNumber) {
        ctx.font = `bold ${Math.round(30 * design.numberFontScale)}px ${design.fontFamily}`;
        ctx.fillStyle = design.textColor;
        ctx.textAlign = 'center';
        ctx.fillText(Math.round(rpm).toString(), CENTER_X, CENTER_Y + 120);
    }

    return canvas.toBuffer('image/png').toString('base64');
};

const getFuelGauge = (fuel: number, capacity: number) => {
    const design = configService.designCfg.fuel;
    const canvas = createCanvas(GAUGE_WIDTH, GAUGE_HEIGHT);
    const ctx = canvas.getContext('2d');

    // Fuel Gauge: E - 1/2 - F
    // Steps = 2 (0=E, 1=1/2, 2=F)
    drawGaugeBackground(ctx, 'FUEL', 0, capacity, 2, '', design, true);

    drawNeedle(ctx, fuel, 0, capacity, design);

    if (design.showNumber) {
        ctx.font = `bold ${Math.round(24 * design.numberFontScale)}px ${design.fontFamily}`;
        ctx.fillStyle = design.textColor;
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.round(fuel)} L`, CENTER_X, CENTER_Y + 120);
    }

    return canvas.toBuffer('image/png').toString('base64');
};

const getGenericGauge = (value: number, min: number, max: number, steps: number, title: string, unit: string, designKey: keyof typeof configService.designCfg) => {
    const design = (configService.designCfg as any)[designKey];
    const canvas = createCanvas(GAUGE_WIDTH, GAUGE_HEIGHT);
    const ctx = canvas.getContext('2d');

    drawGaugeBackground(ctx, title, min, max, steps, unit, design);
    drawNeedle(ctx, value, min, max, design);

    if (design.showNumber) {
        ctx.font = `bold ${Math.round(24 * design.numberFontScale)}px ${design.fontFamily}`;
        ctx.fillStyle = design.textColor;
        ctx.textAlign = 'center';
        ctx.fillText(`${value.toFixed(1)}${unit ? ' ' + unit : ''}`, CENTER_X, CENTER_Y + 120);
    }

    return canvas.toBuffer('image/png').toString('base64');
};

const getPedalMonitor = (throttle: number, brake: number, clutch: number) => {
    const design = configService.designCfg.pedals;
    const canvas = createCanvas(GAUGE_WIDTH, GAUGE_HEIGHT);
    const ctx = canvas.getContext('2d');

    // Draw Background
    ctx.fillStyle = design.backgroundColor;
    ctx.fillRect(0, 0, GAUGE_WIDTH, GAUGE_HEIGHT);

    const barWidth = 60;
    const barHeight = 300;
    const spacing = 40;
    const startX = (GAUGE_WIDTH - (3 * barWidth + 2 * spacing)) / 2;
    const startY = (GAUGE_HEIGHT - barHeight) / 2;

    const drawPedal = (x: number, value: number, color: string, label: string) => {
        // Outline
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, startY, barWidth, barHeight);

        // Fill bar (bottom-up)
        const fillH = barHeight * value;
        ctx.fillStyle = color;
        ctx.fillRect(x, startY + barHeight - fillH, barWidth, fillH);

        // Label
        ctx.font = `bold 18px ${design.fontFamily}`;
        ctx.fillStyle = design.textColor;
        ctx.textAlign = 'center';
        ctx.fillText(label, x + barWidth / 2, startY + barHeight + 30);
        ctx.fillText(`${Math.round(value * 100)}%`, x + barWidth / 2, startY - 20);
    };

    drawPedal(startX, throttle, '#4caf50', 'Gas');
    drawPedal(startX + barWidth + spacing, brake, '#f44336', 'Bremse');
    drawPedal(startX + 2 * (barWidth + spacing), clutch, '#2196f3', 'Kuppl.');

    return canvas.toBuffer('image/png').toString('base64');
};

export const mapGaugeStates = async (telemetry: any) => {
    const states: { id: string, value: string }[] = [];
    const basics = configService.userCfg.Basics;
    const unit = basics.unit.toLowerCase();

    // Speed (telemetry.speed is m/s)
    let speed = telemetry.speed || 0;
    if (unit === 'miles') speed = speed * 2.236936;
    else speed = speed * 3.6;
    if (speed < 0) speed = Math.abs(speed);

    // Basic Gauges
    states.push({ id: 'Nybo.ETS2.Gauges.SpeedGauge', value: getSpeedGauge(speed, unit) });
    states.push({ id: 'Nybo.ETS2.Gauges.RPMGauge', value: getRPMGauge(telemetry.engineRpm || 0, telemetry.engineRpmMax || 0) });
    states.push({ id: 'Nybo.ETS2.Gauges.FuelGauge', value: getFuelGauge(telemetry.fuel || 0, telemetry.fuelCapacity || 0) });

    // Technical Gauges (Conversions)
    const airBar = (telemetry.airPressure || 0) / 14.5038;
    const oilBar = (telemetry.oilPressure || 0) / 14.5038;
    const adbluePct = telemetry.adblueCapacity > 0 ? (telemetry.adblue / telemetry.adblueCapacity) * 100 : 0;

    states.push({ id: 'Nybo.ETS2.Gauges.AirPressureGauge', value: getGenericGauge(airBar, 0, 16, 8, 'AIR', 'Bar', 'air') });
    states.push({ id: 'Nybo.ETS2.Gauges.WaterTempGauge', value: getGenericGauge(telemetry.waterTemperature || 0, 0, 120, 6, 'WATER', '°C', 'water') });
    states.push({ id: 'Nybo.ETS2.Gauges.OilTempGauge', value: getGenericGauge(telemetry.oilTemperature || 0, 0, 150, 5, 'OIL TEMP', '°C', 'oilTemp') });
    states.push({ id: 'Nybo.ETS2.Gauges.OilPressureGauge', value: getGenericGauge(oilBar, 0, 10, 5, 'OIL PRES', 'Bar', 'oilPressure') });
    states.push({ id: 'Nybo.ETS2.Gauges.BatteryGauge', value: getGenericGauge(telemetry.batteryVoltage || 0, 0, 30, 6, 'BATTERY', 'V', 'battery') });
    states.push({ id: 'Nybo.ETS2.Gauges.AdBlueGauge', value: getGenericGauge(adbluePct, 0, 100, 4, 'ADBLUE', '%', 'adblue') });

    // Pedal Monitor
    states.push({
        id: 'Nybo.ETS2.Gauges.PedalMonitor',
        value: getPedalMonitor(telemetry.userThrottle || 0, telemetry.userBrake || 0, telemetry.userClutch || 0)
    });

    return states;
}
