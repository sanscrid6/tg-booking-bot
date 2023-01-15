import {Schema, model, Document} from "mongoose";
import {IOrder} from "./Order";

export interface IUser extends Document{
    _id: string,
    firstName?: string,
    lastName?: string,
    username?: string,
    phoneNumber?: string,
    role: 'ADMIN' | 'USER',
    chatId: string,
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
    firstName: {type: String, },
    lastName: {type: String, },
    username: {type: String, },
    phoneNumber: {type: String, },
    chatId: {type: String, required: true},
    role: {type: String, required: true, default: 'USER'},
    history: [{type: Schema.Types.ObjectId, ref: 'Order'}],
    wishes: [{type: Schema.Types.ObjectId, ref: 'Order'}],
    booked: [{type: Schema.Types.ObjectId, ref: 'Order'}],
    confirmed: [{type: Schema.Types.ObjectId, ref: 'Order'}],
});

export const User = model<IUser>('User', userSchema);
