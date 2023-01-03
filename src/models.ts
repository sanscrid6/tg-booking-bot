import { Schema, model, connect } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({path: './mongo.env'});

interface IUser {
    name: string;
    email: string;
    avatar?: string;
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: String
});

const User = model<IUser>('User', userSchema);


export async function run() {
    const connectionUri = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongo:27017/?authSource=admin`;
    await connect(connectionUri);

    const user = new User({
        name: 'Bill',
        email: 'bill@initech.com',
        avatar: 'https://i.imgur.com/dM7Thhn.png'
    });
    await user.save();

    console.log(user.email); // 'bill@initech.com'
}
