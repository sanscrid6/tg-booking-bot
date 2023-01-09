import {Order} from "../../models/Order";
import {DateTime} from "luxon";
import {dateFormatter} from "../../utils/Formatters";
import {mapOrderStateToEmoji} from "../../utils/Emojies";

export const getActualDates = async () => {
    const orders = await Order.find({date: {$gt: DateTime.local().toISODate()}});
    const renderOrders: Array<Array<{text: string, callback_data: string}>> = [];
    const lineLength = 3;

    for(let i = 0; i < orders.length; i++){
        const index = ~~(i / lineLength);
        if(!renderOrders[index]){
            renderOrders[index] = [];
        }
        renderOrders[index].push({
            text: `${dateFormatter.format(orders[i].date)} ${mapOrderStateToEmoji(orders[i])}`,
            callback_data: orders[i].id
        })
    }

    return renderOrders;
}
