import { configService } from '../services/ConfigService';

export const mapWorldStates = (telemetry: any) => {
    const minutes = telemetry.timeAbs;
    const states: { id: string, value: string }[] = [];

    if (minutes === undefined || minutes === null) return states;

    const timeFormat = configService.userCfg.Basics.timeFormat.toUpperCase();

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

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = days[(day - 1) % 7];
    states.push({ id: 'Nybo.ETS2.World.DayOfWeek', value: dayOfWeek });

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

    states.push({ id: 'Nybo.ETS2.World.MapScale', value: (telemetry.scale ?? 0).toString() });
    states.push({ id: 'Nybo.ETS2.World.MultiplayerOffset', value: (telemetry.multiplayerTimeOffset ?? 0n).toString() });

    return states;
};
