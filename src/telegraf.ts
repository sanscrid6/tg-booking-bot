import {Telegraf} from "telegraf";
import {TOKEN} from "./config";

export const bot = new Telegraf(TOKEN);
