import {Document} from "mongoose";
import {ActionType} from "./Actions";
import {IContext} from "../telegraf";
import {CONTROLLER_TRIGGERS} from "./ControllerTriggers";
import {Message} from "typegram";
import {IUser} from "../models/User";

interface IGenerateOptions<T extends Document> {
    textGetter: (item: T) => string,
    rowLength: number,
    action: ActionType
}

export function generateInlineKeyboard<T extends Document>(arr: Array<T>, options: IGenerateOptions<T>){
    const renderOrders: Array<Array<{text: string, callback_data: string}>> = [];

    for(let i = 0; i < arr.length; i++){
        const index = ~~(i / options.rowLength);
        if(!renderOrders[index]){
            renderOrders[index] = [];
        }
        renderOrders[index].push({
            text: options.textGetter(arr[i]),
            callback_data: `${arr[i].id}${options.action}`
        })
    }

    return renderOrders;
}

export const getKeyboard = (user: IUser) => {
    const userKeyboard = [
        [CONTROLLER_TRIGGERS.DATES_LIST],
        [CONTROLLER_TRIGGERS.MY_BOOKINGS],
    ];
    const adminKeyboard = [
        [CONTROLLER_TRIGGERS.GET_BOOKED_USER]
    ]

    const keyboard = [
        ...userKeyboard,
    ];

    if(user.role === 'ADMIN'){
        keyboard.push(...adminKeyboard);
    }

    return keyboard
}
