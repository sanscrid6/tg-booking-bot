import {Context, Markup} from "telegraf";
import {dateFormatter} from "../../utils/Formatters";
import {logger} from "../../utils/Logger";
import {getActualDates} from "./helpers";
import {ERROR_MESSAGE} from "../../config";
import {getUserAndOrderFromCallbackMessage} from "../../utils/Messages";

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
           const {user, order} = await getUserAndOrderFromCallbackMessage(ctx);

            if(order.bookingType !== 'EMPTY') {
                // todo check user with same id and curr date
                user.wishes = user.wishes ? [...user.wishes, order] : [order];
                await user.save();
                await ctx.answerCbQuery(`Вы стали в очередь на ${dateFormatter.format(order.date)}`);
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
