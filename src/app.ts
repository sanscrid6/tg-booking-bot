import {MONGO_CONNECTION, TIMEZONE, TOKEN} from "./config";
import {connect} from "mongoose";
import {logger} from "./utils/Logger";
import {startHandler} from "./controllers/start";
import {CONTROLLER_TRIGGERS} from "./utils/ControllerTriggers";
import {dateController, dateListController} from "./controllers/date";
import {testController} from "./controllers/test";
import {Settings} from "luxon";
import {dropOrderController, myBookingsController} from "./controllers/profile";
import {bot} from "./telegraf";
import {scheduleJobs} from "./workers/executor";
import {ActionType} from "./utils/Actions";

const main = async () => {
    Settings.defaultZone = TIMEZONE;
    await connect(MONGO_CONNECTION);

    bot.start(startHandler);
    scheduleJobs();

    bot.hears(CONTROLLER_TRIGGERS.DATES_LIST, dateListController);
    bot.hears(CONTROLLER_TRIGGERS.MY_BOOKINGS, myBookingsController);
    bot.hears('/test', testController)
    ///\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/

    bot.action(new RegExp(`^[\\w\\d]{24}${ActionType.Book}$`), dateController);
    bot.action(new RegExp(`^[\\w\\d]{24}${ActionType.Drop}$`), dropOrderController);

    bot.launch();
    logger.info('bot started');

    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

main();

