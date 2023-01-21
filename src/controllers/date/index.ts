import {Context, Markup} from "telegraf";
import {dateFormatter, localDate} from "../../utils/Formatters";
import logger from "../../utils/Logger";
import {getActualDates, getUserOrders} from "./helpers";
import {ERROR_MESSAGE} from "../../config";
import {getUserAndOrderFromCallbackMessage} from "../../utils/Messages";
import {generateInlineKeyboard} from "../../utils/Keyboard";
import {IOrder} from "../../models/Order";
import {EMOJIES, mapUserOrderStateToEmoji} from "../../utils/Emojies";
import {ActionType} from "../../utils/Actions";
import {DateTime} from "luxon";
import {CONTROLLER_TRIGGERS} from "../../utils/ControllerTriggers";

export const dateListController = async (ctx: Context) => {
    try {
        if(!ctx.state.user.phoneNumber){
            await ctx.reply('Вы не подтвердили свой номер телефона');
            return;
        }

        const renderOrders = await getActualDates();
        await ctx.reply(`Доступные даты. ${EMOJIES.GREEN_CIRCLE} - свободная дата, ${EMOJIES.YELLOW_CIRCLE} - забронированная, ${EMOJIES.RED_CIRCLE} - подтвержденная`,
            Markup.inlineKeyboard(renderOrders));
    } catch (e) {
        logger.error(e);
        await ctx.reply(ERROR_MESSAGE);
    }
};

export const bookOrderController = async (ctx: Context) => {
    try {
        if(ctx.callbackQuery){
            const {user, order} = await getUserAndOrderFromCallbackMessage(ctx, ['booked', 'wishes', 'confirmed']);
            const orderDate = DateTime.fromISO(order.date.toISOString());

            if(orderDate < localDate){
                await ctx.answerCbQuery(`Обновите список достпуных дат нажав "${CONTROLLER_TRIGGERS.DATES_LIST}"`);
            }
            else if(order.bookingType !== 'EMPTY') {
                const booked = [...(user.booked || []), ...(user.confirmed || [])];

                if(booked && booked.find(booked => booked.id === order.id)){
                    await ctx.answerCbQuery(`Вы уже забронировали ${dateFormatter.format(order.date)}`);
                }
                else if (!user.wishes?.find(wish => wish === order._id)){
                    user.wishes = user.wishes ? [...user.wishes, order] : [order];
                    await user.save();
                }

                await ctx.answerCbQuery(`Вы стали в очередь на ${dateFormatter.format(order.date)}`);
            }
            else if(order.bookingType === 'EMPTY'){
                if(orderDate.diff(localDate, 'days').days === 0){
                    user.confirmed = user.confirmed ? [...user.confirmed, order] : [order];
                    order.bookingType = 'CONFIRMED';
                    await Promise.all([user.save(), order.save()]);
                    await ctx.answerCbQuery(`Вы подтвердили заказ на ${dateFormatter.format(order.date)}`);
                } else {
                    order.bookingType = 'BOOKED';
                    user.booked = user.booked ? [...user.booked, order] : [order];
                    user.wishes = user.wishes?.filter(wish => wish !== order._id);

                    await Promise.all([order.save(), user.save()]);
                    await ctx.answerCbQuery(`Вы успешно забронировали ${dateFormatter.format(order.date)}`);
                }
            }

            const renderOrders = await getActualDates();
            await ctx.editMessageReplyMarkup({inline_keyboard: renderOrders});
        }
    } catch (e) {
        logger.error(e);
        await ctx.answerCbQuery(ERROR_MESSAGE);
    }
}


export const dropOrderController = async (ctx: Context) => {
    try {
        if(ctx.callbackQuery){
            const {user, order} = await getUserAndOrderFromCallbackMessage(ctx, ['booked', 'confirmed']);

            order.bookingType = 'EMPTY';
            user.booked = user.booked?.filter(item => item.id !== order.id);
            user.confirmed = user.confirmed?.filter(item => item.id !== order.id);
            await Promise.all([order.save(), user.save()]);

            await ctx.editMessageReplyMarkup({inline_keyboard: getUserOrders(user)})
            await ctx.answerCbQuery(`Вы отказались от ${dateFormatter.format(order.date)}`);
        }
    } catch (e) {
        await ctx.answerCbQuery(ERROR_MESSAGE);
        logger.error(e)
    }
}

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
