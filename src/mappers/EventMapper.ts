export const mapEventStates = (telemetry: any) => {
    const states: { id: string, value: string }[] = [];

    // trucksim-telemetry (flat object) usually populates these if they occur.
    // If not, we might need event listeners, but let's try mapping first.

    const refuel = telemetry.refuelAmount || 0;
    if (refuel > 0) {
        states.push({ id: 'Nybo.ETS2.Event.RefuelAmount', value: refuel.toFixed(2) });
    }

    if (telemetry.tollgatePayAmount > 0) {
        states.push({ id: 'Nybo.ETS2.Event.TollgatePayAmount', value: `${telemetry.tollgatePayAmount}€` });
    }
    if (telemetry.ferryPayAmount > 0) {
        states.push({ id: 'Nybo.ETS2.Event.FerryPayAmount', value: `${telemetry.ferryPayAmount}€` });
    }
    if (telemetry.trainPayAmount > 0) {
        states.push({ id: 'Nybo.ETS2.Event.TrainPayAmount', value: `${telemetry.trainPayAmount}€` });
    }

    return states;
};
