import {DateTime} from "luxon";
import {TIMEZONE} from "../config";

export const dateFormatter = Intl.DateTimeFormat('ru', {
    month: 'long',
    day: 'numeric',
})

export const localDate = (withLocalTimezone=true) => {
    let date = DateTime.local().set({hour: 0, minute: 1, second: 0, millisecond: 0});
    if(withLocalTimezone){
        date = date.setZone(TIMEZONE);
    }
    return date;
}
