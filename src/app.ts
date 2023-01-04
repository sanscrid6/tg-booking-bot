import {MONGO_CONNECTION, TOKEN} from "./config";
import {connect} from "mongoose";
import {logger} from "./utils/Logger";
import {Telegraf} from "telegraf";
import {startHandler} from "./controllers/start";
import {CONTROLLER_TRIGGERS} from "./utils/ControllerTriggers";
import {dateController, dateListController} from "./controllers/date";
import {testController} from "./controllers/test";


const main = async () => {
    await connect(MONGO_CONNECTION);
    const bot = new Telegraf(TOKEN);

    bot.start(startHandler);

    bot.hears(CONTROLLER_TRIGGERS.DATES_LIST, dateListController);
    bot.hears('/test', testController)

    bot.action(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/, dateController)

    bot.launch();
    logger.info('bot started');

    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

main();

