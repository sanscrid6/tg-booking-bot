import moment from "moment";
import {Order} from "../models/Order";
import {logger} from "../utils/Logger";

class OrderWorker{
    // todo timezone
    async spawnNewOrders(){
        const daysRange = 31;
        for(let i = 0; i < daysRange; i++){
            const date = moment()
                .set('hour', 23)
                .set('minutes', 59)
                .set('second', 0)
                .set('milliseconds', 0)
                .add(i, 'days');

            const order = await Order.findOne({date: date.toISOString()});
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
