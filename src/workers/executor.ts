import schedule from 'node-schedule';
import {orderWorker} from "./OrderWorker";

// todo separate from main app ?
export const scheduleJobs = () => {
    schedule.scheduleJob({hour: 0, minute: 0}, orderWorker.spawnNewOrders)
    schedule.scheduleJob({hour: 0, minute: 0}, orderWorker.sendConfirmations)
};
