import * as exposes from '../lib/exposes';
import fz from '../converters/fromZigbee';
import tz from '../converters/toZigbee';
import * as reporting from '../lib/reporting';
import * as tuya from '../lib/tuya';
const e = exposes.presets;
const ea = exposes.access;

const definitions: Definition[] = [
    {
        fingerprint: [{modelID: 'TS0219', manufacturerName: '_TZ3000_vdfwjopk'}],
        model: 'SA100',
        vendor: 'Cleverio',
        description: 'Smart siren',
        fromZigbee: [fz.ts0216_siren, fz.ias_alarm_only_alarm_1, fz.power_source],
        toZigbee: [tz.warning, tz.ts0216_volume],
        exposes: [e.warning(), e.binary('alarm', ea.STATE, true, false),
            e.numeric('volume', ea.ALL).withValueMin(0).withValueMax(100).withDescription('Volume of siren')],
        meta: {disableDefaultResponse: true},
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(1);
            const bindClusters = ['genPowerCfg'];
            await reporting.bind(endpoint, coordinatorEndpoint, bindClusters);
        },
    },
    {
        fingerprint: [{modelID: 'TS0041A', manufacturerName: '_TYZB01_4qw4rl1u'}],
        model: 'SB100',
        vendor: 'Cleverio',
        description: 'Wireless switch with 1 button',
        exposes: [e.battery(), e.action(['single', 'double', 'hold'])],
        fromZigbee: [fz.tuya_on_off_action, fz.battery],
        toZigbee: [],
        configure: tuya.configureMagicPacket,
    },
];

module.exports = definitions;
