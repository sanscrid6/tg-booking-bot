import {Telegraf, Context} from "telegraf";
import {TOKEN} from "./config";
import {IUser} from "./models/User";

export interface IContext extends Context{
    user?: IUser,
}

export const bot = new Telegraf<IContext>(TOKEN);

