import dotenv from 'dotenv';

dotenv.config({path: '../.env'});

export const TOKEN: string = process.env.TG_TOKEN || "";
