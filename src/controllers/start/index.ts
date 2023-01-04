import {Context} from "telegraf";
import {User} from "../../models/User";
import {logger} from "../../utils/logger";


export const startHandler = async (ctx: Context) => {
    if(ctx.from){
        const user = await User.findById(ctx.from.id);

        if(!user){
            logger.info(`create new user ${ctx.from.id}`);
            await User.create({
                _id: ctx.from.id,
                firstName: ctx.from.first_name,
                lastName: ctx.from.last_name,
                username: ctx.from.username
            })
        }

    }
    else {
        logger.error(`cant get id from ${ctx.from}`);
    }
}
