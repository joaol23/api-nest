import { config } from "dotenv";
import { DataSource } from "typeorm";

config({
    path: process.env.ENV === "test" ? '.env.test': '.env'
});

const dataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "teste",
    password: "password",
    database: process.env.DBNAME,
    migrations: [`${__dirname}/migrations/**/*.js`]
});

export default dataSource;