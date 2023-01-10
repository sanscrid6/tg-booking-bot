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
                    chatId: ctx.chat?.id ?? -1
                })

                logger.info(`create new user ${ctx.from.id}`);
            }

        }
        else {
            logger.error(`cant get id from ${ctx.from}`);
        }

        await ctx.reply(`Привет`, Markup
            .keyboard([
                [CONTROLLER_TRIGGERS.DATES_LIST],
                [CONTROLLER_TRIGGERS.MY_BOOKINGS],
            ])
            .oneTime()
            .resize()
        )
    } catch (e) {
        logger.error(e);
        await ctx.reply(ERROR_MESSAGE)
    }
}
