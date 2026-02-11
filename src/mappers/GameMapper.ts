export const mapGameStates = (telemetry: any) => {
    // telemetry is the full data
    const states: { id: string, value: string }[] = [];

    if (!telemetry) return states;

    states.push({ id: 'Nybo.ETS2.Game.ConnectedStatus', value: (telemetry.sdkActive ?? false).toString() });

    const gameId = telemetry.game; // 1=ETS2, 2=ATS
    const gameName = gameId === 1 ? 'ETS2' : (gameId === 2 ? 'ATS' : 'Unknown');
    states.push({ id: 'Nybo.ETS2.Game.GameType', value: gameName });
    states.push({ id: 'Nybo.ETS2.Game.IsPaused', value: (telemetry.paused ?? false).toString() });

    // Versions
    states.push({ id: 'Nybo.ETS2.Game.Version', value: `${telemetry.versionMajor ?? 0}.${telemetry.versionMinor ?? 0}` });
    states.push({ id: 'Nybo.ETS2.Game.TelemetryVersion', value: `${telemetry.telemetryVersionGameMajor ?? 0}.${telemetry.telemetryVersionGameMinor ?? 0}` });
    states.push({ id: 'Nybo.ETS2.Game.PluginVersion', value: (telemetry.telemetryPluginRevision ?? 0).toString() });

    // Simulation
    states.push({ id: 'Nybo.ETS2.Game.Scale', value: (telemetry.scale ?? 0).toString() });

    // Timestamps (BigInt to String)
    states.push({ id: 'Nybo.ETS2.Game.Timestamp', value: (telemetry.time ?? 0n).toString() });
    states.push({ id: 'Nybo.ETS2.Game.SimulationTimestamp', value: (telemetry.simulatedTime ?? 0n).toString() });
    states.push({ id: 'Nybo.ETS2.Game.RenderTimestamp', value: (telemetry.renderTime ?? 0n).toString() });
    states.push({ id: 'Nybo.ETS2.Game.MultiplayerOffset', value: (telemetry.multiplayerTimeOffset ?? 0n).toString() });

    return states;
};
