import {IContext} from "../../telegraf";
import {Message} from "typegram/message";
import {User} from "../../models/User";
import logger from "../../utils/Logger";
import {ERROR_MESSAGE} from "../../config";

export const makeAdminController = async (ctx: IContext) => {
    try {
        if(ctx.state.user.role !== 'ADMIN'){
            return;
        }

        const msg = ctx.message as Message.TextMessage;
        const phoneNumber = msg.text.split(' ')[1];

        if(!phoneNumber){
            await ctx.reply(`Вы не ввели номер`);
            return;
        }

        const user = await User.findOne({phoneNumber});

        if(!user){
            await ctx.reply(`У данного бота нет пользователя с телефоном ${phoneNumber}, проверьте, что вы вводите номер без проблеов и скобок`);
            return;
        }

        user.role = 'ADMIN';
        await user.save();
        await ctx.reply(`Пользователь с номером телефона ${phoneNumber} стал администратором, для того, чтобы активировать права админимтратора нужно перезайти в бота`);
    } catch (e) {
        logger.error('make admin error');
        logger.error(e);
        await ctx.sendMessage(ERROR_MESSAGE);
    }
}
