import logger from "../../utils/Logger";
import {IContext} from "../../telegraf";
import {Markup} from "telegraf";
import {ERROR_MESSAGE} from "../../config";
import {Message} from "typegram/message";
import {getKeyboard} from "../../utils/Keyboard";

export const phoneVerificationController = async (ctx: IContext) => {
    try {
        const contactMsg = ctx.message as Message.ContactMessage;

        const number = contactMsg.contact.phone_number.replace(/\s/, '');
        ctx.state.user.phoneNumber = number.startsWith('+') ? number : `+${number}`;
        ctx.state.user.save();

        const keyboard = getKeyboard(ctx.state.user);

        await ctx.sendMessage('Вы успешно подтвердити номер телефона',
            Markup
            .keyboard(keyboard)
            .resize())
    } catch (e) {
        logger.error('phone verification error');
        logger.error(e);
        await ctx.sendMessage(ERROR_MESSAGE);
    }
}

export const textController = async (ctx: IContext) => {
    try {
        let keyboard;
        if(ctx.state.user.phoneNumber){
            keyboard = getKeyboard(ctx.state.user);
        }else {
            keyboard = [[{request_contact: true, text: 'Подтвердить номер телефона'}]]
        }

        await ctx.sendMessage('Используйте клавиатру для взаимодействия с ботом',
            Markup
                .keyboard(keyboard)
                .resize())
    } catch (e) {
        logger.error('phone verification error');
        logger.error(e);
        await ctx.sendMessage(ERROR_MESSAGE);
    }
}
