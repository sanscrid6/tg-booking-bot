import {MONGO_CONNECTION, TIMEZONE, TOKEN} from "./config";
import {connect} from "mongoose";
import {logger} from "./utils/Logger";
import {startHandler} from "./controllers/start";
import {CONTROLLER_TRIGGERS} from "./utils/ControllerTriggers";
import {
    bookOrderController,
    confirmedOrderController,
    confirmOrderController,
    dateListController,
    dropOrderController
} from "./controllers/date";
import {testController} from "./controllers/test";
import {Settings} from "luxon";
import {myBookingsController} from "./controllers/profile";
import {bot} from "./telegraf";
import {scheduleJobs} from "./workers/executor";
import {ActionType} from "./utils/Actions";
import {todayConfirmedController} from "./controllers/admin";
import {adminMiddleware} from "./middlevares/AdminMiddleware";

const main = async () => {
    Settings.defaultZone = TIMEZONE;
    await connect(MONGO_CONNECTION);

    bot.start(startHandler);

    bot.use(adminMiddleware);

    bot.hears(CONTROLLER_TRIGGERS.DATES_LIST, dateListController);
    bot.hears(CONTROLLER_TRIGGERS.MY_BOOKINGS, myBookingsController);
    bot.hears(CONTROLLER_TRIGGERS.GET_BOOKED_USER, todayConfirmedController);
    bot.hears('/test', testController);

    bot.action(new RegExp(`^[\\w\\d]{24}${ActionType.Book}$`), bookOrderController);
    bot.action(new RegExp(`^[\\w\\d]{24}${ActionType.Drop}$`), dropOrderController);
    bot.action(new RegExp(`^[\\w\\d]{24}${ActionType.Confirm}$`), confirmOrderController);
    bot.action(new RegExp(`^[\\w\\d]{24}${ActionType.Confirmed}$`), confirmedOrderController);

    bot.launch();

    scheduleJobs();

    logger.info('bot started');

    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

main();

