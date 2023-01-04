import {MONGO_CONNECTION, TOKEN} from "./config";
import {connect} from "mongoose";
import {logger} from "./utils/logger";
import {Telegraf} from "telegraf";
import {startHandler} from "./controllers/start";


const main = async () => {
    await connect(MONGO_CONNECTION);
    const bot = new Telegraf(TOKEN);

    bot.start(startHandler);
    bot.launch();
    logger.info('bot started');

    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

main();

