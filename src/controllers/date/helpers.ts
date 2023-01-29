import {IOrder, Order} from "../../models/Order";
import {DateTime} from "luxon";
import {dateFormatter, localDate} from "../../utils/Formatters";
import {mapOrderStateToEmoji, mapUserOrderStateToEmoji} from "../../utils/Emojies";
import {generateInlineKeyboard} from "../../utils/Keyboard";
import {ActionType} from "../../utils/Actions";
import {IUser} from "../../models/User";
import {TIMEZONE} from "../../config";

export const getActualDates = async () => {
    const orders = await Order.find({date: {$gt: DateTime.local().toISODate()}});

    return generateInlineKeyboard<IOrder>(orders, {
        textGetter: order => `${dateFormatter.format(order.date)} ${mapOrderStateToEmoji(order)}`,
        rowLength: 2,
        action: ActionType.Book
    });
}


export const getUserOrders = (user: IUser) => {
    const booked = user.booked || [];
    const confirmed = user.confirmed || [];
    let allOrders = [...booked, ...confirmed];

    const comparer = (a: IOrder, b: IOrder) =>
        DateTime.fromISO(a.date.toISOString()).setZone(TIMEZONE).diff(DateTime.fromISO(b.date.toISOString()).setZone(TIMEZONE), 'days').days;

    allOrders = allOrders.filter(order => DateTime.fromISO(order.date.toISOString()).setZone(TIMEZONE) >= localDate()).sort(comparer)

    return generateInlineKeyboard<IOrder>(allOrders, {
        textGetter: order => `${dateFormatter.format(order.date)} ${mapUserOrderStateToEmoji(order)}`,
        rowLength: 2,
        action: ActionType.Drop
    });
}
