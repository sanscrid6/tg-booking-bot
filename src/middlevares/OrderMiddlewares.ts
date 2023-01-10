import {User} from "../models/User";
import {IOrder} from "../models/Order";
import {bot} from "../telegraf";
import {dateFormatter} from "../utils/Formatters";

export const wishesMiddleware = async (order: IOrder) => {
    if(order.bookingType === "EMPTY"){
        const users = await User.find({wishes: order._id}).populate('wishes');
        users.forEach(u => {
            bot.telegram.sendMessage(+u.chatId,`Заказ на ${dateFormatter.format(order.date)} свободен`);
        })
    }
}
