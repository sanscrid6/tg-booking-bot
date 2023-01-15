import {Context, Markup} from "telegraf";
import {User} from "../../models/User";
import {logger} from "../../utils/Logger";
import {CONTROLLER_TRIGGERS} from "../../utils/ControllerTriggers";
import {ERROR_MESSAGE} from "../../config";


export const startHandler = async (ctx: Context) => {
    try {
        if(ctx.from){
            const user = await User.findById(ctx.from.id);
            if(!user){
                 await User.create({
                    _id: ctx.from.id,
                    firstName: ctx.from.first_name,
                    lastName: ctx.from.last_name,
                    username: ctx.from.username,
                    chatId: ctx.chat?.id ?? -1,
                })

                logger.info(`create new user ${ctx.from.id}`);
            }

            await ctx.reply(`Привет ${ctx.from.first_name}`, Markup
                .keyboard( [{request_contact: true, text: 'Подтвердить номер телефона'}])
                .oneTime()
                .resize());

        }
        else {
            throw new Error(`cant get id from ${ctx.from}`);
        }
    } catch (e) {
        logger.error(e);
        await ctx.reply(ERROR_MESSAGE)
    }
}
