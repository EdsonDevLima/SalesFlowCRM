import { DataSourceOptions } from "typeorm";

export const conn: DataSourceOptions = {
    type: "mysql",
    database: process.env.DATABASE_NAME || "",
    host: process.env.DATABASE_HOST || "",
    port: parseInt(process.env.DATABASE_PORT || "3306"),
    username: process.env.DATABASE_USERNAME || "root",
    password: process.env.DATABASE_PASSWORD,
    synchronize: true,
    entities: []
}