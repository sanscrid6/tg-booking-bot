import {IContext} from "../../telegraf";
import {Message} from "typegram/message";
import {User} from "../../models/User";
import {logger} from "../../utils/Logger";
import {ERROR_MESSAGE} from "../../config";

export const makeAdminController = async (ctx: IContext) => {
    try {
        if(ctx.state.user.role !== 'ADMIN'){
            return;
        }

        const msg = ctx.message as Message.TextMessage;
        const username = msg.text.split(' ')[1];

        if(!username){
            await ctx.reply(`У данного бота нет пользователя с ником ${username}, проверьте что вы вводите ник без @`);
            return;
        }

        const user = await User.findOne({username});

        if(!user){
            await ctx.reply(`У данного бота нет пользователя с ником ${username}, проверьте что вы вводите ник без @`);
            return;
        }

        user.role = 'ADMIN';
        await user.save();
        await ctx.reply(`Пользователь с ником ${username} стал администратором`);
    } catch (e) {
        logger.error('make admin error');
        logger.error(e);
        await ctx.sendMessage(ERROR_MESSAGE);
    }
}
