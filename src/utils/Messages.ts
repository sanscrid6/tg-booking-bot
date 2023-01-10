import {CallbackQuery} from "typegram/markup";
import {User} from "../models/User";
import {Order} from "../models/Order";
import {Context} from "telegraf";

export const getUserAndOrderFromCallbackMessage = async (ctx: Context, populate: Array<string> = []) => {
    const callbackQuery = ctx.callbackQuery as CallbackQuery.DataQuery;
    const orderId = callbackQuery.data.slice(0, 24);
    const userId = callbackQuery.from.id;

    const userQuery = User.findById(userId);
    if(populate){
       userQuery.populate(populate);
    }

    const [user, order] = await Promise.all([
        userQuery,
        Order.findById(orderId)
    ]);

    if(!user){
        throw new Error(`cant find user with id ${userId}`);
    }

    if(!order){
        throw new Error(`cant find order with date ${orderId}`);
    }

    return {user, order};
}
