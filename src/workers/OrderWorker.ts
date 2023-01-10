import {Order} from "../models/Order";
import {logger} from "../utils/Logger";
import { DateTime } from "luxon";

class OrderWorker{
    async spawnNewOrders(){
        const daysRange = 31;
        for(let i = 0; i < daysRange; i++){
            const date = DateTime.local().plus({days: i});
            const order = await Order.findOne({date: date.toISODate()});

            if(!order){
                await Order.create({
                    date: date
                });
            }
        }

        logger.info('spawn new orders');
    }
}


export const orderWorker = new OrderWorker();
