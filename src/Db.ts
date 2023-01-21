import {connect} from "mongoose";
import {MONGO_CONNECTION} from "./config";
import {addAdmin} from "./migrations/AddAdmin";

export const initDb = async () => {
    await connect(MONGO_CONNECTION);
    await addAdmin();
}
