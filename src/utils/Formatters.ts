import {DateTime} from "luxon";

export const dateFormatter = Intl.DateTimeFormat('ru', {
    month: 'long',
    day: 'numeric',
})

export const localDate = () => DateTime.local().set({hour: 0, minute: 1, second: 0, millisecond: 0});
