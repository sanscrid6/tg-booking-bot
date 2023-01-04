import {Schema, model} from "mongoose";

interface IOrder {
    time: Date,
    bookingType: 'BOOKED' | 'CONFIRMED' | 'EMPTY',
}

const userSchema = new Schema<IOrder>({
    time: {type: Date, required: true},
    bookingType: {type: String, required: true, default: 'EMPTY'},
});

export const Order = model<IOrder>('Order', userSchema);
