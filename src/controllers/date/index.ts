import {Context, Markup} from "telegraf";
import {Order} from "../../models/Order";
import {DateTime} from "luxon";
import {CallbackQuery} from "typegram/markup";
import {dateFormatter} from "../../utils/Formatters";

export const dateListController = async (ctx: Context) => {
    const orders = await Order.find({date: {$gt: DateTime.local().toISODate()}});
    const renderOrders: Array<Array<{text: string, callback_data: string}>> = [];
    const lineLength = 3;
    for(let i = 0; i < orders.length; i++){
        const index = ~~(i / lineLength);
        if(!renderOrders[index]){
          renderOrders[index] = [];
        }
        renderOrders[index].push({text: dateFormatter.format(orders[i].date), callback_data: orders[i].date.toISOString()})
    }
    return ctx.reply('Доступные даты',
        Markup.inlineKeyboard(renderOrders));
};


export const dateController = async (ctx: Context) => {
    if(ctx.callbackQuery){
        const q = ctx.callbackQuery as CallbackQuery.DataQuery;
        console.log(q.data, typeof ctx.callbackQuery);
    }
    return ctx.answerCbQuery('qq');
    // return ctx.answerInlineQuery(['hear']);
}
