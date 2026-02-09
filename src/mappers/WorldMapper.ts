import { configService } from '../services/ConfigService';

export const mapWorldStates = (telemetry: any) => {
    // telemetry.timeAbs comes as minutes (int) usually.
    // Wait, V2 might return `gameTime` date object or similar?
    // trucksim-telemetry documentation: `timeAbs` (in-game time in minutes).
    // `time` is not a standard property in flat object unless we construct it?
    // But `stateManager` passes the raw data.

    // Convert minutes to Date object for formatting?
    // 0 minutes = Day 1, 00:00?

    // Let's assume we can calculate it from `timeAbs`.
    const minutes = telemetry.timeAbs;
    const states: { id: string, value: string }[] = [];

    if (minutes === undefined || minutes === null) return states;

    const timeFormat = configService.userCfg.Basics.timeFormat.toUpperCase();

    // Calculate Date from minutes
    const day = Math.floor(minutes / (24 * 60)) + 1;
    const hour = Math.floor((minutes % (24 * 60)) / 60);
    const min = Math.floor(minutes % 60);

    // We don't have Year/Month easily from just minutes unless we track it or assume default.
    // But usually ETS2 time is just Day + HH:MM.
    // V1 parsed a full date string? "0001-01-01...".
    // Does `trucksim-telemetry` expose aformatted date?
    // `telemetry.time` might not exist on raw object.

    // Let's format as Day X, HH:MM
    let formattedTime = '';
    const hhs = hour.toString().padStart(2, '0');
    const mms = min.toString().padStart(2, '0');

    if (timeFormat === 'US') {
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const h12 = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
        formattedTime = `Day ${day}, ${h12}:${mms} ${ampm}`;
    } else {
        formattedTime = `Day ${day}, ${hhs}:${mms}`;
    }

    states.push({ id: 'Nybo.ETS2.World.Time', value: formattedTime });
    return states;
};
