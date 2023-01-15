import schedule from 'node-schedule';
import {orderWorker} from "./OrderWorker";
import {TIMEZONE} from "../config";

// todo schedule to env
export const scheduleJobs = () => {
    schedule.scheduleJob({hour: 0, minute: 3, tz: TIMEZONE}, orderWorker.spawnNewOrders);
    schedule.scheduleJob({hour: 0, minute: 4, tz: TIMEZONE}, orderWorker.sendConfirmations);
    schedule.scheduleJob({hour: 0, minute: 5, tz: TIMEZONE}, orderWorker.checkOrderConfirmed);
};
