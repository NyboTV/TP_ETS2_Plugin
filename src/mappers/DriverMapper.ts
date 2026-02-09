export const mapDriverStates = (telemetry: any) => {
    const nextRestStopTime = telemetry.nextRestStopTime;
    const states: { id: string, value: string }[] = [];

    if (!nextRestStopTime) return states;

    // V1 format: 0001-01-01T15:00:00Z -> HH:MM
    try {
        const parts = nextRestStopTime.split(/[-T:Z]/);
        // [0]=Year, [1]=Month, [2]=Day, [3]=Hour, [4]=Min
        const hh = parts[3];
        const mm = parts[4];
        states.push({ id: 'Nybo.ETS2.Driver.NextRestTime', value: `${hh}:${mm}` });
    } catch (e) {
        states.push({ id: 'Nybo.ETS2.Driver.NextRestTime', value: 'Error' });
    }

    return states;
};
