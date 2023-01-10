import {Context, Markup} from "telegraf";
import {dateFormatter} from "../../utils/Formatters";
import {logger} from "../../utils/Logger";
import {getActualDates} from "./helpers";
import {ERROR_MESSAGE} from "../../config";
import {getUserAndOrderFromCallbackMessage} from "../../utils/Messages";
import {generateInlineKeyboard} from "../../utils/Keyboard";
import {IOrder} from "../../models/Order";
import {mapOrderStateToEmoji, mapUserOrderStateToEmoji} from "../../utils/Emojies";
import {ActionType} from "../../utils/Actions";

export const dateListController = async (ctx: Context) => {
    try {
        const renderOrders = await getActualDates();
        await ctx.reply('Доступные даты', Markup.inlineKeyboard(renderOrders));
    } catch (e) {
        logger.error(e);
        await ctx.reply(ERROR_MESSAGE);
    }
};

export const bookOrderController = async (ctx: Context) => {
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


export const dropOrderController = async (ctx: Context) => {
    try {
        if(ctx.callbackQuery){
            const {user, order} = await getUserAndOrderFromCallbackMessage(ctx, ['booked']);

            order.bookingType = 'EMPTY';
            user.booked = user.booked?.filter(item => item.id !== order.id) ?? [];
            await Promise.all([order.save(), user.save()]);

            const renderOrders = generateInlineKeyboard<IOrder>(user.booked || [], {
                textGetter: item => `${dateFormatter.format(item.date)} ${mapUserOrderStateToEmoji(item)}`,
                rowLength: 2,
                action: ActionType.Drop
            });

            await ctx.editMessageReplyMarkup({inline_keyboard: renderOrders})
            await ctx.answerCbQuery(`Вы отказались от ${dateFormatter.format(order.date)}`);
        }
    } catch (e) {
        await ctx.answerCbQuery(ERROR_MESSAGE);
        logger.error(e)
    }
}

// todo быстро покликать на все коллбэки
export const confirmOrderController = async (ctx: Context) => {
    try {
        if(ctx.callbackQuery){
            const {user, order} = await getUserAndOrderFromCallbackMessage(ctx, ['booked']);

            order.bookingType = 'CONFIRMED';
            user.booked = user.booked?.filter(item => item.id !== order.id) ?? [];
            user.confirmed = user.confirmed? [...user.confirmed, order] : [order];
            await Promise.all([order.save(), user.save()]);

            await ctx.editMessageReplyMarkup({inline_keyboard: [[
                    {
                        text: `Заказ на ${dateFormatter.format(order.date)} подтвержден ${mapUserOrderStateToEmoji(order)}`,
                        callback_data: `${order.id.toString('hex')}${ActionType.Confirmed}`,
                    }
                ]]})
            await ctx.answerCbQuery(`Вы подтвердили заказ на ${dateFormatter.format(order.date)}`);
        }
    } catch (e) {
        await ctx.answerCbQuery(ERROR_MESSAGE);
        logger.error(e)
    }
}

export const confirmedOrderController = async (ctx: Context) => {
    try {
        if(ctx.callbackQuery){
            const {order} = await getUserAndOrderFromCallbackMessage(ctx, ['booked']);
            await ctx.answerCbQuery(`Вы уже подтвердили заказ на ${dateFormatter.format(order.date)}`);
        }
    } catch (e) {
        await ctx.answerCbQuery(ERROR_MESSAGE);
        logger.error(e)
    }
}
