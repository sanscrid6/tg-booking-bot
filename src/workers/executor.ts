import schedule from 'node-schedule';
import {orderWorker} from "./OrderWorker";
import {TIMEZONE} from "../config";

// todo separate from main app ?
export const scheduleJobs = () => {
    schedule.scheduleJob({hour: 0, minute: 3, tz: TIMEZONE}, orderWorker.spawnNewOrders)
    schedule.scheduleJob({hour: 0, minute: 3, tz: TIMEZONE}, orderWorker.sendConfirmations)
};
