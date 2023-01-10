import {Context, Markup} from "telegraf";
import {User} from "../../models/User";
import {generateInlineKeyboard} from "../../utils/Keyboard";
import {IOrder, Order} from "../../models/Order";
import {dateFormatter} from "../../utils/Formatters";
import {EMOJIES} from "../../utils/Emojies";
import {CallbackQuery} from "typegram/markup";
import {getActualDates} from "../date/helpers";

export const myBookingsController = async (ctx: Context) => {
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
}

export const dropOrderController = async (ctx: Context) => {
    if(ctx.callbackQuery){
        const callbackQuery = ctx.callbackQuery as CallbackQuery.DataQuery;
        const orderId = callbackQuery.data.slice(0, 24);
        const userId = callbackQuery.from.id;

        const [user, order] = await Promise.all([
            User.findById(userId).populate('booked'),
            Order.findById(orderId)
        ]);

        if(!user){
            throw new Error(`cant find user with id ${userId}`);
        }

        if(!order){
            throw new Error(`cant find order with date ${orderId}`);
        }

        order.bookingType = 'EMPTY';
        user.booked = user.booked?.filter(order => order.id.toString('hex') !== orderId) ?? [];
        await Promise.all([order.save(), user.save()]);
        console.log(user.booked);

        const renderOrders = generateInlineKeyboard<IOrder>(user.booked || [], {
            textGetter: item => `${dateFormatter.format(item.date)} ${item.bookingType === 'CONFIRMED'? EMOJIES.GREEN_CIRCLE : EMOJIES.YELLOW_CIRCLE}`,
            rowLength: 3,
            action: "DROP"
        });

        await ctx.editMessageReplyMarkup({inline_keyboard: renderOrders})
        await ctx.answerCbQuery(`Вы отказались от ${dateFormatter.format(order.date)}`);
    }
}
