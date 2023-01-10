import {IOrder, Order} from "../../models/Order";
import {DateTime} from "luxon";
import {dateFormatter} from "../../utils/Formatters";
import {mapOrderStateToEmoji} from "../../utils/Emojies";
import {generateInlineKeyboard} from "../../utils/Keyboard";

export const getActualDates = async () => {
    const orders = await Order.find({date: {$gt: DateTime.local().toISODate()}});

    return generateInlineKeyboard<IOrder>(orders, {
        textGetter: order => `${dateFormatter.format(order.date)} ${mapOrderStateToEmoji(order)}`,
        rowLength: 2,
        action: "BOOK"
    });
}
