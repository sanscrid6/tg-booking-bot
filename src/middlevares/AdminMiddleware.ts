import {Context} from "telegraf";
import {Message} from 'typegram/message';
import {User} from "../models/User";
import {CONTROLLER_TRIGGERS} from "../utils/ControllerTriggers";


export const adminMiddleware = async (ctx: Context, next: () => Promise<void>) => {
    try {
        const msg = ctx.message as Message.TextMessage;

        if(!msg){
            next();
            return;
        }

        if(msg.from){
            const user = await User.findById(msg.from.id);

            if(!user){
                return;
            }

            if(user.role === 'USER'){
                if(msg.text === CONTROLLER_TRIGGERS.GET_BOOKED_USER){
                    return;
                }
            }
        }

        next();
    } catch (e) {
        console.log(e);
    }
}
