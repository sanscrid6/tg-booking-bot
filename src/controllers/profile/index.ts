import {Context, Markup} from "telegraf";
import {User} from "../../models/User";
import {generateInlineKeyboard} from "../../utils/Keyboard";
import {IOrder} from "../../models/Order";
import {dateFormatter} from "../../utils/Formatters";
import {EMOJIES, mapUserOrderStateToEmoji} from "../../utils/Emojies";
import {logger} from "../../utils/Logger";
import {ERROR_MESSAGE} from "../../config";
import {ActionType} from "../../utils/Actions";
import {DateTime} from "luxon";

export const myBookingsController = async (ctx: Context) => {
    try {
        if(ctx.from){
            const user = await User.findById(ctx.from.id).populate(['booked', 'confirmed']);

            if(!user){
                return;
            }

            const booked = user.booked || [];
            const confirmed = user.confirmed || [];
            const allOrders = [...booked, ...confirmed];
            // todo order by date
            const comparer = (a: IOrder, b: IOrder) =>
                DateTime.fromISO(b.date.toString()).diff(DateTime.fromISO(a.date.toString()), 'days').days
            allOrders.sort(comparer)

            const renderOrders = generateInlineKeyboard<IOrder>(allOrders, {
                textGetter: order => `${dateFormatter.format(order.date)} ${mapUserOrderStateToEmoji(order)}`,
                rowLength: 2,
                action: ActionType.Drop
            });

            await ctx.reply(`Ваши престоящие заказы. ${EMOJIES.GREEN_CIRCLE} - подтвержденный, ${EMOJIES.YELLOW_CIRCLE} - неподтвержденный. Нажмите на заказ, если хотите отказаться`,
                Markup.inlineKeyboard(renderOrders));
        }
    } catch (e) {
        logger.error(e);
        await ctx.answerCbQuery(ERROR_MESSAGE);
    }
}
