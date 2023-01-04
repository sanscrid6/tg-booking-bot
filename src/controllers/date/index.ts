import {Context, Markup} from "telegraf";
import {Order} from "../../models/Order";
import moment from "moment";
import {ICallbackData} from "../../utils/interfaces";

// todo remove moment
export const dateListController = async (ctx: Context) => {
    const orders = await Order.find({date: {$gt: moment().toISOString()}})
    // orders.map(order => ({text: `${order.date}`, callback_data: `${order.date}`}))
    const renderOrders: Array<Array<{text: string, callback_data: string}>> = []
    const lineLength = 3;
    for(let i = 0; i < orders.length; i++){
        const index = ~~(i / lineLength);
        if(!renderOrders[index]){
          renderOrders[index] = [];
        }
        renderOrders[index].push({text: orders[i].date.toISOString(), callback_data: orders[i].date.toISOString()})
    }
    return ctx.reply('Доступные даты',
        Markup.inlineKeyboard(renderOrders));
};


export const dateController = async (ctx: Context) => {
    if(ctx.callbackQuery){
        const q = ctx.callbackQuery as ICallbackData;
        console.log(q.data);
    }
    return ctx.answerCbQuery('qq');
    // return ctx.answerInlineQuery(['hear']);
}
