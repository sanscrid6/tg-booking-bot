import {Context} from "telegraf";
import {Message} from 'typegram/message';
import {User} from "../models/User";
import {CONTROLLER_TRIGGERS} from "../utils/ControllerTriggers";


export const adminMiddleware = async (ctx: Context, next: () => Promise<void>) => {
    try {
        let user;
        if(ctx.from){
            user = await User.findById(ctx.from.id);
            ctx.state.user = user;
        }
    } catch (e) {
        console.log(e);
    }
    finally {
        next();
    }
}
