import { DataSource } from "typeorm";

const dataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "teste",
    password: "password",
    database: "api",
    migrations: [`${__dirname}/migrations/**/*.js`]
});

export default dataSource;