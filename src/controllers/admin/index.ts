import {Context} from "telegraf";
import {Order} from "../../models/Order";
import {dateFormatter, localDate} from "../../utils/Formatters";
import {User} from "../../models/User";
import {logger} from "../../utils/Logger";
import {ERROR_MESSAGE} from "../../config";


export const todayConfirmedController = async (ctx: Context) => {
    try {
        const order = await Order.findOne({date: localDate.toISO()});
        if(!order){
            throw new Error(`cant find order on ${localDate.toISO}`);
        }
        const user = await User.findOne({confirmed: order._id});
        if(!user){
            await ctx.reply('На сегодня нет броней')
        }
        else{
            await ctx.reply(`Подтверждена бронь на ${dateFormatter.format(order.date)}, ${user.firstName} ${user.lastName} ${user.username}`);
        }
    } catch (e) {
        logger.error('today confirmed')
        await ctx.reply(ERROR_MESSAGE);
    }
}
