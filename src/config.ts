import dotenv from 'dotenv';

dotenv.config();
dotenv.config({path: './mongo.env'});

export const TOKEN: string = process.env.TG_TOKEN || "";
export const MONGO_CONNECTION = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongo:27017/?authSource=admin`;
export const TIMEZONE = process.env.TIMEZONE || 'Europe/Minsk';
