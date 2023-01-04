import {Schema, model} from "mongoose";

// todo check if bot has access to all fields

interface IUser {
    _id: string,
    firstName: string,
    lastName: string,
    username: string,
    role: 'Admin' | 'User',
}

const userSchema = new Schema<IUser>({
    _id: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    username: {type: String, required: true},
    role: {type: String, required: true, default: 'User'}
});

export const User = model<IUser>('User', userSchema);
