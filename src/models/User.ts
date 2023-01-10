import {Schema, model, Document} from "mongoose";
import {IOrder} from "./Order";

// todo check if bot has access to all fields

export interface IUser extends Document{
    _id: string,
    firstName: string,
    lastName: string,
    username: string,
    role: 'ADMIN' | 'USER',
    history?: IOrder[],
    // очередь для желаний
    wishes?: IOrder[],
    // для забронированных
    booked?: IOrder[],
    // для подтвержденных
    confirmed?: IOrder[],
}

const userSchema = new Schema<IUser>({
    _id: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    username: {type: String, required: true},
    role: {type: String, required: true, default: 'USER'},
    history: [{type: Schema.Types.ObjectId, ref: 'Order'}],
    wishes: [{type: Schema.Types.ObjectId, ref: 'Order'}],
    booked: [{type: Schema.Types.ObjectId, ref: 'Order'}],
    confirmed: [{type: Schema.Types.ObjectId, ref: 'Order'}],
});

export const User = model<IUser>('User', userSchema);
