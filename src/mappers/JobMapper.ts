import { configService } from '../services/ConfigService';
import fs from 'fs-extra';
import path from 'path';
import { logger } from '../services/LoggerService';

// We need to load currency.json
let currencyData: any = null;
const loadCurrencyData = async () => {
    try {
        const p = path.join(process.cwd(), 'config', 'currency.json');
        if (await fs.pathExists(p)) {
            currencyData = await fs.readJson(p);
        }
    } catch (e) {
        logger.error(`Failed to load currency.json: ${e}`);
    }
};
loadCurrencyData();

export const mapJobStates = async (telemetry: any) => {
    // telemetry flat object
    const states: { id: string, value: string }[] = [];
    if (!telemetry) return states;

    const userCurrency = configService.userCfg.Basics.currency;
    const gameId = telemetry.game;
    const game = gameId === 1 ? 'ETS2' : (gameId === 2 ? 'ATS' : 'Unknown');

    // Income
    const { convert } = require('current-currency');

    // Income
    let income = parseInt(telemetry.jobIncome); // Ensure number
    let symbol = '€';
    let displayValue = '';

    // Check if we need conversion
    // ATS default USD, ETS2 default EUR.
    // If userCurrency differs from game currency, convert.

    const isATS = game === 'ATS';
    const isETS2 = game === 'ETS2';

    // Determine source currency
    let sourceCurrency = isATS ? 'USD' : 'EUR'; // Default fallback
    if (isATS) sourceCurrency = 'USD';
    if (isETS2) sourceCurrency = 'EUR';

    // OfflineMode check is in ConfigService, but we can access via configService.cfg.OfflineMode
    const offline = configService.cfg.OfflineMode;

    if (!offline && userCurrency !== sourceCurrency) {
        try {
            const res = await convert(sourceCurrency, income, userCurrency);
            income = Math.round(res.amount);

            if (currencyData && currencyData.currency && currencyData.currency[res.currency]) {
                symbol = currencyData.currency[res.currency];
            } else {
                symbol = res.currency;
            }

            // Format: Symbol Value (e.g. $ 5000) or Value Symbol (5000 €)
            if (symbol === '€') {
                displayValue = `${income.toLocaleString()} ${symbol}`;
            } else {
                displayValue = `${symbol} ${income.toLocaleString()}`;
            }

        } catch (e) {
            logger.error(`[JobMapper] Currency conversion failed: ${e}`);
            // Fallback to original
            displayValue = `${income.toLocaleString()} (Err)`;
        }
    } else {
        // No conversion
        if (isATS && userCurrency === 'USD') symbol = '$';
        if (isETS2 && userCurrency === 'EUR') symbol = '€';

        // If symbol not set by game logic above, try looking up userCurrency in json
        if (symbol === '€' && userCurrency !== 'EUR') {
            if (currencyData && currencyData.currency && currencyData.currency[userCurrency]) {
                symbol = currencyData.currency[userCurrency];
            }
        }

        if (symbol === '€') {
            displayValue = `${income.toLocaleString()} ${symbol}`;
        } else {
            displayValue = `${symbol} ${income.toLocaleString()}`;
        }
    }

    states.push({ id: 'Nybo.ETS2.Job.JobIncome', value: displayValue });

    // Times

    const deliveryTime = telemetry.timeAbsDelivery;
    const currentTime = telemetry.timeAbs;
    if (deliveryTime > 0) {
        const remainingSeconds = (deliveryTime - currentTime) * 60; // timeAbs is in GAMETIME MINUTES usually in SDK?
        // Wait, SDK documentation says `timeAbs` is "in-game time in minutes".

        const remainingMinutes = deliveryTime - currentTime;
        if (remainingMinutes > 0) {
            const days = Math.floor(remainingMinutes / (24 * 60));
            const hours = Math.floor((remainingMinutes % (24 * 60)) / 60);
            const mins = Math.floor(remainingMinutes % 60);

            states.push({ id: 'Nybo.ETS2.Job.JobRemainingTime', value: `${days}D, ${hours}:${mins}` });
        } else {
            states.push({ id: 'Nybo.ETS2.Job.JobRemainingTime', value: 'Overdue' });
        }
    } else {
        states.push({ id: 'Nybo.ETS2.Job.JobRemainingTime', value: '-' });
    }

    states.push({ id: 'Nybo.ETS2.Job.JobSourceCity', value: telemetry.citySrc });
    states.push({ id: 'Nybo.ETS2.Job.JobSourceCompany', value: telemetry.compSrc });
    states.push({ id: 'Nybo.ETS2.Job.JobDestinationCity', value: telemetry.cityDst });
    states.push({ id: 'Nybo.ETS2.Job.JobDestinationCompany', value: telemetry.compDst });

    return states;
};
