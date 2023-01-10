import {Context, Markup} from "telegraf";
import {Order} from "../../models/Order";
import {CallbackQuery} from "typegram/markup";
import {dateFormatter} from "../../utils/Formatters";
import {User} from "../../models/User";
import {logger} from "../../utils/Logger";
import {getActualDates} from "./helpers";
import {ERROR_MESSAGE} from "../../config";

export const dateListController = async (ctx: Context) => {
    try {
        const renderOrders = await getActualDates();
        await ctx.reply('Доступные даты', Markup.inlineKeyboard(renderOrders));
    } catch (e) {
        logger.error(e);
        await ctx.reply(ERROR_MESSAGE);
    }
};

export const dateController = async (ctx: Context) => {
    try {
        if(ctx.callbackQuery){
            const callbackQuery = ctx.callbackQuery as CallbackQuery.DataQuery;
            const orderId = callbackQuery.data.slice(0,24);
            const userId = callbackQuery.from.id;

            const [user, order] = await Promise.all([
                User.findById(userId),
                Order.findById(orderId)
            ]);

            if(!user){
                throw new Error(`cant find user with id ${userId}`);
            }

            if(!order){
                throw new Error(`cant find order with date ${orderId}`);
            }

            if(order.bookingType !== 'EMPTY') {
                // todo check user with same id
                user.wishes = user.wishes ? [...user.wishes, order] : [order];
                await user.save();
                await ctx.answerCbQuery(`Вы стали в очкредь на ${dateFormatter.format(order.date)}`);
                return;
            }

            order.bookingType = 'BOOKED';
            user.booked = user.booked ? [...user.booked, order] : [order];

            await Promise.all([order.save(), user.save()]);
            const renderOrders = await getActualDates();
            await ctx.editMessageReplyMarkup({inline_keyboard: renderOrders})
            await ctx.answerCbQuery(`Вы успешно забронировали ${dateFormatter.format(order.date)}`);
        }
    } catch (e) {
        logger.error(e);
        await ctx.answerCbQuery(ERROR_MESSAGE);
    }
}
