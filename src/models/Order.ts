import {Schema, model} from "mongoose";

export interface IOrder extends Document{
    date: Date,
    bookingType: 'BOOKED' | 'CONFIRMED' | 'EMPTY',
    // user?
}

const userSchema = new Schema<IOrder>({
    date: {type: Date, required: true},
    bookingType: {type: String, required: true, default: 'EMPTY'},
});

export const Order = model<IOrder>('Order', userSchema);
