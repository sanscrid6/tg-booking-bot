import {START_ADMIN} from "../config";
import {User} from "../models/User";

interface ITgUser {
    id: number,
    first_name: string,
    last_name: string,
    username: string,
    chat_id: string,
}

export const addAdmin = async () => {
    const admin = JSON.parse(START_ADMIN) as ITgUser;
    if(!admin.id){
        console.error(`cant find id in start admin`);
        return;
    }

    let u = await User.findById(admin.id);

    if(!u){
        u = new User({
            _id: admin.id,
            firstName: admin.first_name,
            lastName: admin.last_name,
            username: admin.username,
            role: 'ADMIN',
            chatId: admin.chat_id,
        })

        await u.save();
    }
}
