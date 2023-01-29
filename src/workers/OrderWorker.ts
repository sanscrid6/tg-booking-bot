import {Order} from "../models/Order";
import logger from "../utils/Logger";
import { DateTime } from "luxon";
import {User} from "../models/User";
import {bot} from "../telegraf";
import {dateFormatter, localDate} from "../utils/Formatters";
import {ActionType} from "../utils/Actions";
import {TIMEZONE} from "../config";

class OrderWorker{
    async spawnNewOrders(){
        try {
            const daysRange = 14;
            for(let i = 0; i < daysRange; i++){
                const date = DateTime.local()
                    .setZone(TIMEZONE)
                    .set({hour: 0, minute: 1, second: 0, millisecond: 0})
                    .plus({days: i});
                const order = await Order.findOne({date: date.toISO()});

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
            const confirmationDelay = 2;
            const confirmationDateMax = DateTime.local().setZone(TIMEZONE).plus({days: confirmationDelay});
            const orders = await Order.find({date: {
                    $gte: DateTime.local().setZone(TIMEZONE).toISODate(),
                    $lt: confirmationDateMax
                }});
            for(const order of orders){
                // должен быть только один польователь
                const user = await User.findOne({booked: order._id});
                if(!user){
                    continue;
                }
                await bot.telegram.sendMessage(+user.chatId, `Нажмите на сообщение ниже, чтобы подтверить`, {
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
        try {
            const verificationDelay = 1;
            const verificationDate = DateTime.local().setZone(TIMEZONE).plus({days: verificationDelay});
            const orders = await Order.find({
                date: {
                    $gte: DateTime.local().setZone(TIMEZONE).toISODate(),
                    $lt: verificationDate
                },
                bookingType: 'BOOKED'
            });

            for(const order of orders){
                order.bookingType = 'EMPTY';
                await order.save()

                const userWhoBooked = await User.findOne({booked: order._id}).populate('booked');
                if(userWhoBooked){
                    userWhoBooked.booked = userWhoBooked.booked?.filter(item => item.id !== order.id) ?? [];
                    await userWhoBooked.save();
                    await bot.telegram.sendMessage(+userWhoBooked.chatId, `Бронь на ${dateFormatter.format(order.date)} снимается, так как вы ее не подтвердили`);
                }
            }
            logger.info('checking confirmations');
        } catch (e) {
            logger.error(`checking confirmations error`);
            logger.error(e);
        }
    }
}


export const orderWorker = new OrderWorker();
