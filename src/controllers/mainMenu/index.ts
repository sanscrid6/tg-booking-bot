import {Context, Markup} from "telegraf";
import {CONTROLLER_TRIGGERS} from "../../utils/ControllerTriggers";

export const mainMenuController = async (ctx: Context) => {
    return ctx.reply('Custom buttons keyboard', Markup
        .keyboard([
            [CONTROLLER_TRIGGERS.DATES_LIST],
        ])
        .oneTime()
        .resize()
    )
}
