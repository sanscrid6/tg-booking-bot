import {Order} from "../models/Order";
import {logger} from "../utils/Logger";
import { DateTime } from "luxon";
import {User} from "../models/User";
import {bot} from "../telegraf";
import {dateFormatter} from "../utils/Formatters";
import {ActionType} from "../utils/Actions";

class OrderWorker{
    async spawnNewOrders(){
        try {
            const daysRange = 14;
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
        } catch (e) {
            logger.error('spawn orders error');
            logger.error(e);
        }
    }

    async sendConfirmations(){
        try {
            const verificationDelay = 2;
            const verificationDate = DateTime.local().plus({days: verificationDelay});
            const orders = await Order.find({date: {
                    $gte: DateTime.local().toISODate(),
                    $lt: verificationDate
                }});
            for(const order of orders){
                // должен быть только один польователь
                const user = await User.findOne({booked: order._id});
                if(!user){
                    continue;
                }
                await bot.telegram.sendMessage(+user.chatId, `Нажмите на сообщение ниже чтобы подтверить`, {
                    reply_markup: {
                        inline_keyboard: [[
                            {
                                text: `Подтвердить заказ на ${dateFormatter.format(order.date)}`,
                                callback_data: `${order.id.toString('hex')}${ActionType.Confirm}`
                            }
                        ]]
                    }}
                )
            }
            logger.info('sending confirmations')
        } catch (e) {
            logger.error(`confirmation error`);
            logger.error(e);
        }
    }

    async checkOrderConfirmed(){

    }
}


export const orderWorker = new OrderWorker();
