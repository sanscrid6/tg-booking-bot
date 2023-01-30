import {Context} from "telegraf";
import {Order} from "../../models/Order";
import {dateFormatter, dateUTC, localDate} from "../../utils/Formatters";
import {User} from "../../models/User";
import logger from "../../utils/Logger";
import {ERROR_MESSAGE, TIMEZONE} from "../../config";
import {IContext} from "../../telegraf";
import {DateTime} from "luxon";


export const todayConfirmedController = async (ctx: IContext) => {
    try {
        if(ctx.state.user.role !== 'ADMIN'){
            return;
        }

        const date = dateUTC().toISO();
        const order = await Order.findOne({date});
        if(!order){
            throw new Error(`cant find order on ${date}`);
        }

        const user = await User.findOne({confirmed: order._id});

        if(!user){
            await ctx.reply('На сегодня нет броней');
        }
        else{
            await ctx.reply(`Подтверждена бронь на ${dateFormatter.format(order.date)}, ${user.firstName}${user.lastName ? ' ' + user.lastName: ''}, телефон - ${user.phoneNumber}`);
        }
    } catch (e) {
        logger.error('today confirmed error');
        logger.error(e);
        await ctx.reply(ERROR_MESSAGE);
    }
}
