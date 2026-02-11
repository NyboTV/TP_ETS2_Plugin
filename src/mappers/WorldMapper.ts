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

    // 1. Basic Time Info
    const day = Math.floor(minutes / (24 * 60)) + 1;
    const hour = Math.floor((minutes % (24 * 60)) / 60);
    const min = Math.floor(minutes % 60);

    const hhs = hour.toString().padStart(2, '0');
    const mms = min.toString().padStart(2, '0');

    let timeHHMM = '';
    if (timeFormat === 'US') {
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const h12 = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
        timeHHMM = `${h12}:${mms} ${ampm}`;
    } else {
        timeHHMM = `${hhs}:${mms}`;
    }

    states.push({ id: 'Nybo.ETS2.World.Time', value: `Day ${day}, ${timeHHMM}` });
    states.push({ id: 'Nybo.ETS2.World.TimeHHMM', value: timeHHMM });

    // 2. Day of Week
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = days[(day - 1) % 7];
    states.push({ id: 'Nybo.ETS2.World.DayOfWeek', value: dayOfWeek });

    // 3. Next Rest Stop Arrival (Absolute)
    const restStopMinutes = telemetry.restStop || 0;
    if (restStopMinutes > 0) {
        const totalRestMin = minutes + restStopMinutes;
        const rDay = Math.floor(totalRestMin / (24 * 60)) + 1;
        const rHour = Math.floor((totalRestMin % (24 * 60)) / 60);
        const rMin = Math.floor(totalRestMin % 60);
        const rDayOfWeek = days[(rDay - 1) % 7].substring(0, 3);

        let rTime = '';
        if (timeFormat === 'US') {
            const ampm = rHour >= 12 ? 'PM' : 'AM';
            const h12 = rHour > 12 ? rHour - 12 : (rHour === 0 ? 12 : rHour);
            rTime = `${h12}:${rMin.toString().padStart(2, '0')} ${ampm}`;
        } else {
            rTime = `${rHour.toString().padStart(2, '0')}:${rMin.toString().padStart(2, '0')}`;
        }
        states.push({ id: 'Nybo.ETS2.World.NextRestStopTime', value: `${rDayOfWeek} ${rTime}` });
    } else {
        states.push({ id: 'Nybo.ETS2.World.NextRestStopTime', value: 'Now' });
    }

    // 4. Moved from GameMapper
    states.push({ id: 'Nybo.ETS2.World.MapScale', value: (telemetry.scale ?? 0).toString() });
    states.push({ id: 'Nybo.ETS2.World.MultiplayerOffset', value: (telemetry.multiplayerTimeOffset ?? 0n).toString() });

    return states;
};
