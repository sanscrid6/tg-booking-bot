import {IOrder} from "../models/Order";

export const EMOJIES = {
    RED_CIRCLE: '🔴',
    YELLOW_CIRCLE: '🟡',
    GREEN_CIRCLE: '🟢',
}

export const mapOrderStateToEmoji = (order: IOrder) => {
    switch (order.bookingType) {
        case "BOOKED":
            return EMOJIES.YELLOW_CIRCLE;
        case "CONFIRMED":
            return EMOJIES.RED_CIRCLE;
        case "EMPTY":
            return EMOJIES.GREEN_CIRCLE;
    }
}

export const mapUserOrderStateToEmoji = (order: IOrder) => {
        switch (order.bookingType) {
            case "BOOKED":
                return EMOJIES.YELLOW_CIRCLE;
            case "CONFIRMED":
                return EMOJIES.GREEN_CIRCLE;
        }
    }
