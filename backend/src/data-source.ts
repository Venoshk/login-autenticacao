import dotenv from "dotenv"
dotenv.config();

import { DataSource } from "typeorm"
import { User } from "./entities/User";

const port = process.env.PORT as number | undefined;
const DB_USER = process.env.DB_USER as string | undefined;
const DB_PASSWORD = process.env.DB_PASSWORD as string | undefined;

const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.9ignkn2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

export const appDataSource = new DataSource({
    type:"mongodb",
    host:'localhost',
    port:port,
    url: uri,
    entities:[User]
})