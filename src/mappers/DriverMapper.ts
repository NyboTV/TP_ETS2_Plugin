export const mapDriverStates = (telemetry: any) => {
    const states: { id: string, value: string }[] = [];

    // restStop: Time until next rest stop (in in-game minutes)
    const restStopMinutes = telemetry.restStop;

    if (restStopMinutes === undefined || restStopMinutes === null) {
        return states;
    }

    try {
        if (restStopMinutes <= 0) {
            states.push({ id: 'Nybo.ETS2.Driver.NextRestTime', value: '00:00' });
            states.push({ id: 'Nybo.ETS2.Driver.SleepState', value: 'Sofort Pause machen!' });
        } else {
            const hours = Math.floor(restStopMinutes / 60);
            const minutes = Math.floor(restStopMinutes % 60);
            const hh = hours.toString().padStart(2, '0');
            const mm = minutes.toString().padStart(2, '0');
            states.push({ id: 'Nybo.ETS2.Driver.NextRestTime', value: `${hh}:${mm}` });

            if (restStopMinutes < 60) states.push({ id: 'Nybo.ETS2.Driver.SleepState', value: 'Dringend Pause!' });
            else if (restStopMinutes < 180) states.push({ id: 'Nybo.ETS2.Driver.SleepState', value: 'Müde' });
            else states.push({ id: 'Nybo.ETS2.Driver.SleepState', value: 'Ausgeruht' });
        }

        if (telemetry.fineAmount > 0) {
            states.push({ id: 'Nybo.ETS2.Driver.LastFineAmount', value: `${telemetry.fineAmount}€` });
            states.push({ id: 'Nybo.ETS2.Driver.LastFineOffence', value: telemetry.fineOffence || 'Unbekannt' });
        }

        states.push({ id: 'Nybo.ETS2.Driver.InputThrottle', value: `${Math.round((telemetry.userThrottle || 0) * 100)}%` });
        states.push({ id: 'Nybo.ETS2.Driver.InputBrake', value: `${Math.round((telemetry.userBrake || 0) * 100)}%` });
        states.push({ id: 'Nybo.ETS2.Driver.InputClutch', value: `${Math.round((telemetry.userClutch || 0) * 100)}%` });

    } catch (e) {
        states.push({ id: 'Nybo.ETS2.Driver.NextRestTime', value: 'Error' });
    }

    return states;
};
