import dotenv from 'dotenv';

dotenv.config();

export const TOKEN: string = process.env.TG_TOKEN || "";
