import {Context} from "telegraf";
import {orderWorker} from "../../workers/OrderWorker";

export const testController = async (ctx: Context) => {
    await orderWorker.spawnNewOrders();
}
