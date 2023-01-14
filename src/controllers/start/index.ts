import {Context, Markup} from "telegraf";
import {User} from "../../models/User";
import {logger} from "../../utils/Logger";
import {CONTROLLER_TRIGGERS} from "../../utils/ControllerTriggers";
import {ERROR_MESSAGE} from "../../config";


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
            // todo test user
            const userKeyboard = [
                [CONTROLLER_TRIGGERS.DATES_LIST],
                [CONTROLLER_TRIGGERS.MY_BOOKINGS],
            ];
            const adminKeyboard = [
                [CONTROLLER_TRIGGERS.GET_BOOKED_USER]
            ]

            if(!user){
                throw new Error('cant find or create user');
            }

            const keyboard = [
                ...userKeyboard,
            ]
            if(user.role === 'ADMIN'){
                keyboard.push(...adminKeyboard);
            }

            await ctx.reply('qw', Markup
                .keyboard(keyboard)
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
