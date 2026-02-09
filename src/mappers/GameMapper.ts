export const mapGameStates = (telemetry: any) => {
    // telemetry is the full data
    const states: { id: string, value: string }[] = [];

    if (!telemetry) return states;

    states.push({ id: 'Nybo.ETS2.Game.ConnectedStatus', value: telemetry.sdkActive.toString() });
    const gameId = telemetry.game; // 1=ETS2, 2=ATS
    const gameName = gameId === 1 ? 'ETS2' : (gameId === 2 ? 'ATS' : 'Unknown');
    states.push({ id: 'Nybo.ETS2.Game.GameType', value: gameName });
    states.push({ id: 'Nybo.ETS2.Game.IsPaused', value: telemetry.paused.toString() });

    return states;
};
