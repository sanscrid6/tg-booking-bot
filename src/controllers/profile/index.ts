import {Context, Markup} from "telegraf";
import {User} from "../../models/User";
import {EMOJIES} from "../../utils/Emojies";
import logger from "../../utils/Logger";
import {ERROR_MESSAGE} from "../../config";
import {getUserOrders} from "../date/helpers";

export const myBookingsController = async (ctx: Context) => {
    try {
        if(ctx.from){
            if(!ctx.state.user.phoneNumber){
                await ctx.reply('Вы не подтвердили свой номер телефона');
                return;
            }

            const user = await User.findById(ctx.from.id).populate(['booked', 'confirmed']);

            if(!user){
                throw new Error(`cant find user with id ${ctx.from.id}`);
            }

            await ctx.reply(`Ваши престоящие заказы. \n${EMOJIES.GREEN_CIRCLE} - подтвержденный, \n${EMOJIES.YELLOW_CIRCLE} - неподтвержденный. \nНажмите на заказ, если хотите отказаться`,
                Markup.inlineKeyboard(getUserOrders(user)));
        }
    } catch (e) {
        logger.error(e);
        await ctx.answerCbQuery(ERROR_MESSAGE);
    }
}
