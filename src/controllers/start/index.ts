import {Context, Markup} from "telegraf";
import {User} from "../../models/User";
import {logger} from "../../utils/Logger";
import {CONTROLLER_TRIGGERS} from "../../utils/ControllerTriggers";
import {ERROR_MESSAGE} from "../../config";
import {getKeyboard} from "../../utils/Keyboard";


export const startHandler = async (ctx: Context) => {
    try {
        if(ctx.from){
            let user = await User.findById(ctx.from.id);
            if(!user){
                 user = await User.create({
                    _id: ctx.from.id,
                    firstName: ctx.from.first_name,
                    lastName: ctx.from.last_name,
                    username: ctx.from.username,
                    chatId: ctx.chat?.id ?? -1,
                })

                logger.info(`create new user ${ctx.from.id}`);
            }

            if(user.phoneNumber){
                const keyboard = getKeyboard(ctx.state.user);
                await ctx.sendMessage(`С возвращением ${ctx.from.first_name}`, Markup.keyboard(keyboard))
            } else {
                await ctx.reply(`Привет ${ctx.from.first_name}, для работы с данным ботом необходимо подтвердить номер телефона`, Markup
                    .keyboard( [{request_contact: true, text: 'Подтвердить номер телефона'}])
                    .oneTime()
                    .resize());
            }
        }
        else {
            throw new Error(`cant get id from ${ctx.from}`);
        }
    } catch (e) {
        logger.error(e);
        await ctx.reply(ERROR_MESSAGE)
    }
}
