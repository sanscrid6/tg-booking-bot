import {Schema, model, Document} from "mongoose";
import {User} from "./User";
import {wishesMiddleware} from "../middlevares/OrderMiddlewares";

export interface IOrder extends Document{
    date: Date,
    bookingType: 'BOOKED' | 'CONFIRMED' | 'EMPTY',
    // user?
    // wish user
    // booked user
    // confirmed user
}

const userSchema = new Schema<IOrder>({
    date: {type: Date, required: true, },
    bookingType: {type: String, required: true, default: 'EMPTY'},
});

userSchema.post('save', wishesMiddleware)

export const Order = model<IOrder>('Order', userSchema);



