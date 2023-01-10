import {Context, Markup} from "telegraf";
import {User} from "../../models/User";
import {generateInlineKeyboard} from "../../utils/Keyboard";
import {IOrder} from "../../models/Order";
import {dateFormatter} from "../../utils/Formatters";
import {EMOJIES, mapOrderStateToEmoji} from "../../utils/Emojies";
import {getUserAndOrderFromCallbackMessage} from "../../utils/Messages";
import {logger} from "../../utils/Logger";
import {ERROR_MESSAGE} from "../../config";

export const myBookingsController = async (ctx: Context) => {
    try {
        if(ctx.from){
            const user = await User.findById(ctx.from.id).populate(['wishes', 'booked', 'confirmed']);
            if(!user){
                return;
            }

            const renderOrders = generateInlineKeyboard<IOrder>(user.booked || [], {
                textGetter: order => `${dateFormatter.format(order.date)} ${order.bookingType === 'CONFIRMED'? EMOJIES.GREEN_CIRCLE : EMOJIES.YELLOW_CIRCLE}`,
                rowLength: 3,
                action: "DROP"
            });

            await ctx.reply(`Ваши престоящие заказы. ${EMOJIES.GREEN_CIRCLE} - подтвержденный, ${EMOJIES.YELLOW_CIRCLE} - неподтвержденный. Нажмите на заказ, если хотите отказаться`,
                Markup.inlineKeyboard(renderOrders));
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
                textGetter: item => `${dateFormatter.format(item.date)} ${mapOrderStateToEmoji(item)}`,
                rowLength: 2,
                action: "DROP"
            });

            await ctx.editMessageReplyMarkup({inline_keyboard: renderOrders})
            await ctx.answerCbQuery(`Вы отказались от ${dateFormatter.format(order.date)}`);
        }
    } catch (e) {
        await ctx.answerCbQuery(ERROR_MESSAGE);
        logger.error(e)
    }
}
