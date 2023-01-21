import { Logger } from "tslog";
import { createStream } from "rotating-file-stream";
import {localDate} from "./Formatters";
import {DateTime} from "luxon";

const stream = createStream("logs/bot.log", {
    size: "10M",
    interval: "7d",
    compress: "gzip",
});

const logger = new Logger();
logger.attachTransport((logObj) => {
    delete logObj._meta;
    stream.write(DateTime.local().toISO() + ' | ' +  JSON.stringify(logObj) + "\n");
})

export default logger;

